// AgenticZillow Copilot — page-aware right-side slide-over dock with a chat
// thread, suggested-prompt chips and a Live Activity Timeline tab.
const { Button, AgentTimelineRow } = window.AgenticZillowDesignSystem_f8327a;

const SUGGESTED = ["Is this a good deal?", "What can I afford?", "Best neighborhoods for me", "Summarize the neighborhood", "Draft an offer"];

function AZCopilot({ open, onClose }) {
  const [tab, setTab] = React.useState("chat");
  return (
    <div aria-hidden={!open} style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 400, zIndex: 1100,
      background: "#fff", boxShadow: "var(--shadow-lg)", borderLeft: "1px solid var(--border-hairline)",
      transform: open ? "translateX(0)" : "translateX(110%)", transition: "transform .26s cubic-bezier(.4,0,.2,1)",
      display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)",
    }}>
      {/* header */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--agentic-gradient)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</span>
            AgenticZillow
          </div>
          <button aria-label="Close" onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--text-muted)" }}>✕</button>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: "18px" }}>You're on the home page — want me to find homes, value yours, or check what you can afford?</p>
      </div>
      {/* tabs */}
      <div style={{ display: "flex", gap: 4, padding: "8px 16px 0", borderBottom: "1px solid var(--border-hairline)" }}>
        {[["chat", "Chat"], ["timeline", "Activity"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            border: "none", background: "transparent", cursor: "pointer", padding: "8px 10px", fontSize: 13, fontWeight: 600,
            color: tab === k ? "var(--blue-600)" : "var(--text-muted)",
            borderBottom: tab === k ? "2px solid var(--blue-600)" : "2px solid transparent", marginBottom: -1,
          }}>{lbl}</button>
        ))}
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {tab === "chat" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: "var(--surface-band)", borderRadius: "4px 14px 14px 14px", padding: "10px 14px", fontSize: 14, color: "var(--text-primary)", lineHeight: "20px" }}>
              On it. I can search listings, analyze a deal, or estimate your budget. What are you hoping to do today?
            </div>
            <div style={{ alignSelf: "flex-end", maxWidth: "85%", background: "var(--blue-600)", color: "#fff", borderRadius: "14px 4px 14px 14px", padding: "10px 14px", fontSize: 14, lineHeight: "20px" }}>
              Find a cozy craftsman under $700k near good coffee in Austin.
            </div>
            <div style={{ alignSelf: "flex-start", maxWidth: "90%", background: "var(--surface-band)", borderRadius: "4px 14px 14px 14px", padding: "10px 14px", fontSize: 14, color: "var(--text-primary)", lineHeight: "20px" }}>
              Looking for a cozy craftsman under $700k near good coffee in Austin — on it. <span style={{ color: "var(--blue-600)", fontWeight: 600, cursor: "pointer" }}>See the agent activity →</span>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, overflow: "hidden" }}>
            <AgentTimelineRow agent="orchestrator" label="Planning 5 steps…" status="ok" time="0.4s" />
            <AgentTimelineRow agent="search" label="Parsing intent → filters (≤$700k, craftsman)" status="ok" time="0.9s" />
            <AgentTimelineRow agent="search" label="Semantic search 'craftsman, cafés' … 41 hits" status="ok" time="1.6s" />
            <AgentTimelineRow agent="market" label="Pulling comps & Zestimate deltas…" status="running" model="Groq · llama-3.3" cost="$0.012" />
          </div>
        )}
      </div>

      {/* suggested chips */}
      <div style={{ padding: "0 16px 10px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SUGGESTED.slice(0, 3).map((c) => (
          <span key={c} style={{ fontSize: 12, fontWeight: 600, color: "var(--blue-600)", border: "1px solid var(--blue-600)", borderRadius: 9999, padding: "5px 11px", cursor: "pointer" }}>✦ {c}</span>
        ))}
      </div>
      {/* composer */}
      <div style={{ padding: 16, borderTop: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border-default)", borderRadius: 9999, padding: "4px 4px 4px 14px" }}>
          <span style={{ color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}>📎</span>
          <input placeholder="Ask AgenticZillow…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)" }} />
          <span style={{ color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}>🎤</span>
          <button aria-label="Send" style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "var(--blue-600)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
window.AZCopilot = AZCopilot;
