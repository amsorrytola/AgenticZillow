"use client";

import { useCopilot } from "./copilot";

const ACTIONS: { label: string; prompt: string }[] = [
  { label: "✦ Is this a good deal?", prompt: "Is this home a good deal?" },
  { label: "✦ Analyze this deal", prompt: "Analyze this deal — comps, ROI, and value vs estimate" },
  { label: "✦ Summarize the neighborhood", prompt: "Summarize this neighborhood" },
  { label: "✦ What's my commute?", prompt: "What's the commute from this home downtown?" },
  { label: "📅 Schedule a tour", prompt: "Schedule a tour of this home" },
  { label: "📝 Draft an offer", prompt: "Draft an offer on this home" },
];

export function InlineAIActions() {
  const { ask } = useCopilot();
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {ACTIONS.map((a) => (
        <button
          key={a.label}
          onClick={() => ask(a.prompt)}
          style={{
            fontSize: 13, fontWeight: 600, color: "var(--blue-600)", background: "#fff",
            border: "1px solid var(--blue-600)", borderRadius: 9999, padding: "7px 14px", cursor: "pointer",
          }}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
