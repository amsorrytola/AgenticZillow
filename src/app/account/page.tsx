"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/ds/buttons/Button.jsx";

const PERSONAS = [
  { id: "guest", name: "Guest", desc: "Browse and chat freely. Saves persist in this browser.", badge: "Default" },
  { id: "first-time", name: "First-time buyer", desc: "Budget-focused guidance, affordability, and starter homes.", badge: "" },
  { id: "investor", name: "Investor", desc: "Cap rates, cash flow, and below-estimate deals up front.", badge: "" },
  { id: "demo", name: "Demo super-user", desc: "All-access showcase account — every feature unlocked.", badge: "All access" },
];

export default function AccountPage() {
  const [active, setActive] = useState("guest");
  useEffect(() => {
    try {
      const v = localStorage.getItem("az_persona");
      if (v) setActive(v);
    } catch { /* ignore */ }
  }, []);
  const choose = (id: string) => {
    setActive(id);
    try { localStorage.setItem("az_persona", id); } catch { /* ignore */ }
  };

  return (
    <div style={{ minHeight: "60vh" }}>
      <CopilotContext page="account" greeting="This is your account. Switch a persona to tailor how I help — first-time buyer, investor, or the all-access demo user." />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px" }}>Your account</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Guest-first — no signup needed. Pick a persona to see tailored agent behavior.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "24px 0" }}>
          {PERSONAS.map((p) => (
            <button key={p.id} onClick={() => choose(p.id)} style={{ textAlign: "left", border: `2px solid ${active === p.id ? "var(--blue-600)" : "var(--border-hairline)"}`, borderRadius: 12, padding: 18, background: active === p.id ? "var(--blue-50)" : "#fff", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
                {p.badge && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: p.id === "demo" ? "#fff" : "var(--blue-600)", background: p.id === "demo" ? "var(--agentic-gradient)" : "var(--blue-100)", borderRadius: 9999, padding: "3px 8px" }}>{p.badge}</span>}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: "18px", margin: "8px 0 0" }}>{p.desc}</p>
              {active === p.id && <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue-600)", marginTop: 10 }}>✓ Active</div>}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/saved"><Button variant="secondary">Saved homes</Button></Link>
          <Link href="/search"><Button>Start searching</Button></Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
