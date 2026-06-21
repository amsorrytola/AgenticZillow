"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCopilot } from "./copilot";

const CHIPS = ["🏡 Find me a home", "💰 What can I afford?", "🖼️ Search by photo"];

export function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const { ask, setOpen } = useCopilot();

  const submit = () => {
    const v = q.trim();
    if (!v) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(v)}`);
  };

  const onChip = (c: string) => {
    if (c.includes("afford")) ask("What can I afford on a $130k salary?");
    else if (c.includes("photo")) setOpen(true);
    else router.push("/search");
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 9999, boxShadow: "var(--shadow-lg)", padding: "6px 6px 6px 22px", maxWidth: 640, margin: "0 auto" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="Try “cozy craftsman under $700k near good coffee in Austin”"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "var(--font-sans)", color: "var(--text-primary)", background: "transparent" }}
        />
        <button aria-label="Search" onClick={submit} style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: "var(--blue-600)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
        {CHIPS.map((c) => (
          <button key={c} onClick={() => onChip(c)} style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 9999, padding: "7px 14px", backdropFilter: "blur(4px)", cursor: "pointer" }}>{c}</button>
        ))}
      </div>
    </>
  );
}
