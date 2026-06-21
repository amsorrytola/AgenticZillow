"use client";

import { useMemo, useState } from "react";
import { CopilotContext } from "@/components/app/CopilotContext";
import { MortgageWidget } from "@/components/app/MortgageWidget";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { useCopilot } from "@/components/app/copilot";
import { fmtPrice } from "@/lib/format";

function NumberField({ label, value, onChange, prefix = "$" }: { label: string; value: number; onChange: (n: number) => void; prefix?: string }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
      {label}
      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-default)", borderRadius: 8, height: 44, padding: "0 12px", marginTop: 6, background: "#fff" }}>
        <span style={{ color: "var(--text-muted)" }}>{prefix}</span>
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ border: "none", outline: "none", fontSize: 15, width: "100%", marginLeft: 4, fontFamily: "var(--font-sans)" }} />
      </div>
    </label>
  );
}

export default function HomeLoansPage() {
  const { ask } = useCopilot();
  const [income, setIncome] = useState(130000);
  const [debts, setDebts] = useState(600);
  const [down, setDown] = useState(80000);
  const [rate, setRate] = useState(6.8);

  const maxPrice = useMemo(() => {
    const monthlyIncome = income / 12;
    const maxPiti = monthlyIncome * 0.36 - debts;
    const r = rate / 100 / 12;
    const piBudget = maxPiti * 0.8;
    const loan = r === 0 ? piBudget * 360 : (piBudget * (1 - Math.pow(1 + r, -360))) / r;
    return Math.max(0, Math.round((loan + down) / 1000) * 1000);
  }, [income, debts, down, rate]);

  return (
    <div>
      <CopilotContext page="home-loans" greeting="Let's figure out your budget. Tell me your income and I'll estimate what you can afford and your monthly payment." />
      <section style={{ background: "var(--blue-50)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>What can you afford?</h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>Estimate your budget, then let the Finance agent tailor it to your goals.</p>
        </div>
      </section>

      <div className="az-two" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Affordability calculator</h2>
          <div className="az-grid-2">
            <NumberField label="Annual income" value={income} onChange={setIncome} />
            <NumberField label="Monthly debts" value={debts} onChange={setDebts} />
            <NumberField label="Down payment" value={down} onChange={setDown} />
            <NumberField label="Interest rate" value={rate} onChange={setRate} prefix="%" />
          </div>
          <div style={{ marginTop: 20, padding: 20, background: "var(--blue-50)", borderRadius: 12, textAlign: "center" }}>
            <div className="az-eyebrow">You could afford up to</div>
            <div className="az-price" style={{ fontSize: 34, fontWeight: 700, color: "var(--blue-600)", margin: "6px 0", fontVariantNumeric: "tabular-nums" }}>{fmtPrice(maxPrice)}</div>
            <Button variant="agentic" pill iconLeft={<span>✦</span>} onClick={() => ask(`I make $${income.toLocaleString()} a year with $${debts}/mo debts and $${down.toLocaleString()} down. What can I afford and show me homes.`)}>Find homes in my budget</Button>
          </div>
        </div>

        <MortgageWidget price={Math.max(300000, maxPrice)} />
      </div>
      <Footer />
    </div>
  );
}
