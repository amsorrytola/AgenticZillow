"use client";

import { useState } from "react";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { useCopilot } from "./copilot";

const ITEMS = [
  { tag: "3 new matches", label: "near your saved search “Austin · 3+ bd”", ask: "Show me the 3 newest 3-bed homes in Austin" },
  { tag: "Price drop", label: "$15k off a home in your Dream homes collection", ask: "Analyze the price drop on my saved Austin home" },
  { tag: "Below estimate", label: "a new listing priced 3% under its AI estimate", ask: "Find homes priced below their AI estimate" },
];

export function ProactiveStrip() {
  const { ask } = useCopilot();
  const [dismissed, setDismissed] = useState<number[]>([]);
  const items = ITEMS.map((it, i) => ({ ...it, i })).filter((it) => !dismissed.includes(it.i));
  if (!items.length) return null;
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px" }}>
      <div style={{ marginBottom: 12 }}>
        <span className="az-eyebrow">✦ From your agent</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map((it) => (
          <div key={it.i} style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 16, background: "#fff", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--blue-600)", marginBottom: 6 }}>{it.tag}</div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: "18px" }}>{it.label}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" variant="ghost" onClick={() => ask(it.ask)}>Shortlist</Button>
              <Button size="sm" variant="ghost" onClick={() => ask(it.ask)}>Analyze</Button>
              <Button size="sm" variant="text" onClick={() => setDismissed((d) => [...d, it.i])}>Dismiss</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
