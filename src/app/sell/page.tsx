"use client";

import { useState } from "react";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { useCopilot } from "@/components/app/copilot";

const STEPS = [
  { n: 1, t: "Get your AI estimate", d: "Our Market agent prices your home from live comps in seconds." },
  { n: 2, t: "Prep & list", d: "Photos, copy, and a pricing strategy — the agent drafts it all." },
  { n: 3, t: "Tours & offers", d: "The Concierge coordinates showings; we surface and compare offers." },
  { n: 4, t: "Close", d: "Track milestones to a smooth, on-time close." },
];

export default function SellPage() {
  const { ask } = useCopilot();
  const [addr, setAddr] = useState("");

  return (
    <div>
      <CopilotContext page="sell" greeting="Thinking of selling? Give me your address and I'll estimate your home's value and walk you through pricing." />
      <section style={{ position: "relative", background: "var(--navy-900)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px", color: "#fff" }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, margin: 0, maxWidth: 640 }}>Sell with a little help from your agents.</h1>
          <p style={{ fontSize: 17, opacity: 0.9, marginTop: 12, maxWidth: 560 }}>Start with a free, instant AI estimate — then let the Pricing agent walk you through the comps behind it.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 24, maxWidth: 520 }}>
            <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Enter your home address" style={{ flex: 1, height: 48, borderRadius: 8, border: "none", padding: "0 16px", fontSize: 15, fontFamily: "var(--font-sans)" }} />
            <Button size="lg" onClick={() => ask(addr ? `Estimate the value of my home at ${addr} and explain the comps` : "Help me price my home to sell")}>Get estimate</Button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 24px" }}>How selling works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue-600)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px" }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: "20px", margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
