import React from "react";

const AGENTS = {
  orchestrator: { icon: "🧭", name: "Orchestrator", color: "var(--blue-600)" },
  search: { icon: "🔎", name: "Search Agent", color: "var(--blue-600)" },
  market: { icon: "📈", name: "Market Analyst", color: "var(--success)" },
  finance: { icon: "💰", name: "Finance Agent", color: "var(--violet)" },
  concierge: { icon: "📅", name: "Tour Concierge", color: "var(--warning)" },
};

/**
 * AgentTimelineRow — one row of the Live Activity Timeline. Agent tag, label,
 * status (running spinner → green check → amber warning), timing, and an
 * optional model/cost note.
 */
export function AgentTimelineRow({ agent = "orchestrator", label, status = "running", time, model, cost, style = {}, ...rest }) {
  const a = AGENTS[agent] || AGENTS.orchestrator;
  const statusEl = {
    running: <span className="az-spinner" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--border-default)", borderTopColor: "var(--blue-600)", display: "inline-block", animation: "az-spin .7s linear infinite" }} />,
    ok: <span style={{ color: "var(--success)", fontSize: 14, fontWeight: 700 }}>✓</span>,
    error: <span style={{ color: "var(--warning)", fontSize: 14, fontWeight: 700 }}>!</span>,
  }[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        borderLeft: `2px solid ${a.color}`,
        background: "var(--white)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 16, display: "flex", justifyContent: "center", marginTop: 1 }}>{statusEl}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.icon} {a.name}</span>
          {time && <span style={{ fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{time}</span>}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{label}</div>
        {(model || cost) && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            {model && <span>ⓘ {model}</span>}
            {model && cost && <span> · </span>}
            {cost && <span style={{ fontVariantNumeric: "tabular-nums" }}>{cost}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
