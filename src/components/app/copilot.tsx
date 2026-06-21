"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { AgentTimelineRow } from "@/components/ds/agentic/AgentTimelineRow.jsx";
import { AskPill } from "@/components/ds/agentic/AskPill.jsx";
import type { AgentEvent, AgentStep, Listing } from "@/lib/domain/types";
import { fmtPrice } from "@/lib/format";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  listings?: Listing[];
  simulated?: string;
};

interface PageContext {
  page?: string;
  listingId?: string;
  metroId?: string;
  greeting?: string;
}

interface CopilotApi {
  open: boolean;
  setOpen: (b: boolean) => void;
  setContext: (c: PageContext) => void;
  ask: (message: string, opts?: { mode?: "chat" | "autonomous" }) => void;
  busy: boolean;
}

const Ctx = createContext<CopilotApi | null>(null);
export const useCopilot = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCopilot must be used within CopilotProvider");
  return c;
};

let _id = 0;
const uid = () => `m${_id++}_${Math.random().toString(36).slice(2, 7)}`;

const SUGGESTED = ["Is this a good deal?", "What can I afford?", "Find me a cozy home near coffee", "Summarize the neighborhood"];

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "timeline">("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [busy, setBusy] = useState(false);
  const [cost, setCost] = useState(0);
  const [input, setInput] = useState("");
  const ctxRef = useRef<PageContext>({});
  const bodyRef = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  const setContext = useCallback((c: PageContext) => {
    ctxRef.current = c;
    force((n) => n + 1);
  }, []);

  const scrollDown = () =>
    requestAnimationFrame(() => {
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    });

  const send = useCallback(
    async (message: string, opts?: { mode?: "chat" | "autonomous" }) => {
      if (!message.trim() || busy) return;
      setOpen(true);
      setTab("chat");
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      setMessages((m) => [...m, { id: uid(), role: "user", content: message }]);
      const aId = uid();
      setMessages((m) => [...m, { id: aId, role: "assistant", content: "" }]);
      setBusy(true);
      setSteps([]);
      setCost(0);
      scrollDown();

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message, history, context: ctxRef.current, mode: opts?.mode ?? "chat" }),
        });
        if (!res.body) throw new Error("no stream");
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n\n")) >= 0) {
            const raw = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 2);
            if (!raw.startsWith("data:")) continue;
            let ev: AgentEvent;
            try {
              ev = JSON.parse(raw.slice(5).trim());
            } catch {
              continue;
            }
            handleEvent(ev, aId);
          }
        }
      } catch {
        setMessages((m) =>
          m.map((x) => (x.id === aId && !x.content ? { ...x, content: "Sorry — I hit a snag. Please try again." } : x)),
        );
      } finally {
        setBusy(false);
        scrollDown();
      }
    },
    [busy, messages],
  );

  function handleEvent(ev: AgentEvent, aId: string) {
    switch (ev.type) {
      case "run_start":
        setSteps([]);
        break;
      case "step":
        setSteps((s) => [...s, ev.step]);
        break;
      case "step_update":
        setSteps((s) => s.map((x) => (x.id === ev.step.id ? ev.step : x)));
        break;
      case "token":
        setMessages((m) => m.map((x) => (x.id === aId ? { ...x, content: x.content + ev.text } : x)));
        scrollDown();
        break;
      case "message":
        setMessages((m) => m.map((x) => (x.id === aId ? { ...x, content: ev.content } : x)));
        break;
      case "listings":
        setMessages((m) => m.map((x) => (x.id === aId ? { ...x, listings: ev.listings.slice(0, 3) } : x)));
        break;
      case "action":
        setMessages((m) => m.map((x) => (x.id === aId ? { ...x, simulated: ev.detail } : x)));
        break;
      case "run_end":
        setCost(ev.costUsd);
        break;
    }
  }

  const ask = useCallback((message: string, opts?: { mode?: "chat" | "autonomous" }) => send(message, opts), [send]);

  const api: CopilotApi = { open, setOpen, setContext, ask, busy };

  return (
    <Ctx.Provider value={api}>
      {children}
      <CopilotFab open={open} onClick={() => setOpen(!open)} />
      <CopilotDock
        open={open}
        tab={tab}
        setTab={setTab}
        messages={messages}
        steps={steps}
        busy={busy}
        cost={cost}
        input={input}
        setInput={setInput}
        onSend={() => {
          const v = input;
          setInput("");
          send(v);
        }}
        onClose={() => setOpen(false)}
        onAuto={() => send("Find me a great home and handle the next steps", { mode: "autonomous" })}
        greeting={ctxRef.current.greeting}
        bodyRef={bodyRef}
      />
    </Ctx.Provider>
  );
}

function CopilotFab({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1090 }}>
      <AskPill fab onClick={onClick} aria-label={open ? "Close AgenticZillow" : "Ask AgenticZillow"} style={open ? { animation: "none" } : { animation: "az-pulse 2.4s ease-out 1" }} />
    </div>
  );
}

function MiniListing({ l }: { l: Listing }) {
  return (
    <Link
      href={`/homes/${l.id}`}
      style={{
        display: "flex", gap: 10, alignItems: "center", textDecoration: "none",
        border: "1px solid var(--border-hairline)", borderRadius: 10, padding: 8, background: "#fff",
      }}
    >
      <img src={l.photos[0]} alt="" style={{ width: 56, height: 44, borderRadius: 6, objectFit: "cover" }} />
      <div style={{ minWidth: 0 }}>
        <div className="az-price" style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{fmtPrice(l.price, l.transaction)}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.address.line1}</div>
      </div>
    </Link>
  );
}

interface DockProps {
  open: boolean;
  tab: "chat" | "timeline";
  setTab: (t: "chat" | "timeline") => void;
  messages: Msg[];
  steps: AgentStep[];
  busy: boolean;
  cost: number;
  input: string;
  setInput: (s: string) => void;
  onSend: () => void;
  onClose: () => void;
  onAuto: () => void;
  greeting?: string;
  bodyRef: React.RefObject<HTMLDivElement | null>;
}

function CopilotDock(p: DockProps) {
  const hasSteps = p.steps.length > 0;
  return (
    <div
      aria-hidden={!p.open}
      style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: 400, maxWidth: "100vw", zIndex: 1100,
        background: "#fff", boxShadow: "var(--shadow-lg)", borderLeft: "1px solid var(--border-hairline)",
        transform: p.open ? "translateX(0)" : "translateX(110%)",
        transition: "transform .26s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)",
      }}
    >
      {/* header */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--agentic-gradient)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</span>
            AgenticZillow
          </div>
          <button aria-label="Close" onClick={p.onClose} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--text-muted)" }}>✕</button>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: "18px" }}>
          {p.greeting ?? "Hi — I can search homes, value one, check what you can afford, analyze a deal, or schedule a tour."}
        </p>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, padding: "8px 16px 0", borderBottom: "1px solid var(--border-hairline)" }}>
        {([["chat", "Chat"], ["timeline", hasSteps ? `Activity · ${p.steps.length}` : "Activity"]] as const).map(([k, lbl]) => (
          <button key={k} onClick={() => p.setTab(k)} style={{
            border: "none", background: "transparent", cursor: "pointer", padding: "8px 10px", fontSize: 13, fontWeight: 600,
            color: p.tab === k ? "var(--blue-600)" : "var(--text-muted)",
            borderBottom: p.tab === k ? "2px solid var(--blue-600)" : "2px solid transparent", marginBottom: -1,
          }}>{lbl}</button>
        ))}
        {p.busy && <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: 11, color: "var(--text-muted)" }}>working…</span>}
      </div>

      {/* body */}
      <div ref={p.bodyRef} style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {p.tab === "chat" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {p.messages.length === 0 && (
              <div style={{ alignSelf: "flex-start", maxWidth: "90%", background: "var(--surface-band)", borderRadius: "4px 14px 14px 14px", padding: "10px 14px", fontSize: 14, lineHeight: "20px" }}>
                On it. Ask me anything — try “Find a cozy craftsman under $700k near good coffee in Austin.”
              </div>
            )}
            {p.messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} style={{ alignSelf: "flex-end", maxWidth: "85%", background: "var(--blue-600)", color: "#fff", borderRadius: "14px 4px 14px 14px", padding: "10px 14px", fontSize: 14, lineHeight: "20px" }}>{m.content}</div>
              ) : (
                <div key={m.id} style={{ alignSelf: "flex-start", maxWidth: "92%", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ background: "var(--surface-band)", borderRadius: "4px 14px 14px 14px", padding: "10px 14px", fontSize: 14, lineHeight: "20px", whiteSpace: "pre-wrap" }}>
                    {m.content || <span style={{ color: "var(--text-muted)" }}>…</span>}
                  </div>
                  {m.simulated && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ background: "var(--warning-fill)", color: "#7a5a00", borderRadius: 9999, padding: "2px 8px", fontWeight: 600 }}>Simulated for demo</span>
                    </div>
                  )}
                  {m.listings && m.listings.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {m.listings.map((l) => <MiniListing key={l.id} l={l} />)}
                      <Link href="/search" style={{ fontSize: 13, fontWeight: 600, color: "var(--blue-600)" }}>See all on the map →</Link>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, overflow: "hidden" }}>
            {!hasSteps && <div style={{ padding: 16, fontSize: 13, color: "var(--text-muted)" }}>Agent activity will stream here when you ask something.</div>}
            {p.steps.map((s) => (
              <AgentTimelineRow
                key={s.id}
                agent={s.agent === "neighborhood" ? "market" : s.agent}
                label={s.label}
                status={s.status === "pending" ? "running" : s.status}
                time={s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : undefined}
                model={s.model}
                cost={s.costUsd ? `$${s.costUsd.toFixed(4)}` : undefined}
              />
            ))}
            {p.cost > 0 && (
              <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border-hairline)", fontSize: 12, color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                <span>Run cost</span>
                <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--text-secondary)" }}>${p.cost.toFixed(4)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* suggested chips */}
      <div style={{ padding: "0 16px 10px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SUGGESTED.slice(0, 3).map((c) => (
          <button key={c} disabled={p.busy} onClick={() => { p.setInput(c); }} style={{ fontSize: 12, fontWeight: 600, color: "var(--blue-600)", border: "1px solid var(--blue-600)", background: "#fff", borderRadius: 9999, padding: "5px 11px", cursor: p.busy ? "default" : "pointer", opacity: p.busy ? 0.5 : 1 }}>✦ {c}</button>
        ))}
        <button onClick={p.onAuto} disabled={p.busy} title="Let the agent run autonomously" style={{ fontSize: 12, fontWeight: 600, color: "#fff", border: "none", background: "var(--agentic-gradient)", borderRadius: 9999, padding: "5px 11px", cursor: p.busy ? "default" : "pointer", opacity: p.busy ? 0.5 : 1 }}>✦ Autopilot</button>
      </div>

      {/* composer */}
      <div style={{ padding: 16, borderTop: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border-default)", borderRadius: 9999, padding: "4px 4px 4px 14px" }}>
          <input
            value={p.input}
            onChange={(e) => p.setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") p.onSend(); }}
            placeholder="Ask AgenticZillow…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }}
          />
          <button aria-label="Send" onClick={p.onSend} disabled={p.busy} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "var(--blue-600)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", opacity: p.busy ? 0.6 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
