"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ds/forms/Select.jsx";
import { fmtPrice } from "@/lib/format";

export function MortgageWidget({ price, hoa = 0 }: { price: number; hoa?: number }) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.8);
  const [term, setTerm] = useState(30);

  const calc = useMemo(() => {
    const down = price * (downPct / 100);
    const loan = price - down;
    const r = rate / 100 / 12;
    const n = term * 12;
    const pi = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const tax = (price * 0.011) / 12;
    const ins = (price * 0.0035) / 12;
    const total = pi + tax + ins + hoa;
    return { total, pi, tax, ins, hoa, down, loan };
  }, [price, downPct, rate, term, hoa]);

  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0", fontWeight: bold ? 700 : 400, color: bold ? "var(--text-primary)" : "var(--text-secondary)" }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 20 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Estimated monthly payment</h3>
      <div className="az-price" style={{ fontSize: 30, fontWeight: 700, color: "var(--blue-600)", margin: "4px 0 16px", fontVariantNumeric: "tabular-nums" }}>{fmtPrice(Math.round(calc.total))}/mo</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Down payment
          <Select size="md" value={String(downPct)} options={[5, 10, 15, 20, 25, 30].map((d) => ({ value: String(d), label: `${d}%` }))} onChange={(v: string) => setDownPct(Number(v))} style={{ marginTop: 6, display: "block" }} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Interest rate
          <Select size="md" value={String(rate)} options={[5.5, 6.0, 6.5, 6.8, 7.0, 7.5].map((d) => ({ value: String(d), label: `${d}%` }))} onChange={(v: string) => setRate(Number(v))} style={{ marginTop: 6, display: "block" }} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Term
          <Select size="md" value={String(term)} options={[15, 20, 30].map((d) => ({ value: String(d), label: `${d} yr` }))} onChange={(v: string) => setTerm(Number(v))} style={{ marginTop: 6, display: "block" }} />
        </label>
      </div>
      <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: 8 }}>
        <Row label="Principal & interest" value={fmtPrice(Math.round(calc.pi))} />
        <Row label="Property taxes" value={fmtPrice(Math.round(calc.tax))} />
        <Row label="Home insurance" value={fmtPrice(Math.round(calc.ins))} />
        {hoa > 0 && <Row label="HOA dues" value={fmtPrice(hoa)} />}
        <div style={{ borderTop: "1px solid var(--border-hairline)", marginTop: 6 }}>
          <Row label="Total / month" value={`${fmtPrice(Math.round(calc.total))}`} bold />
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>Down payment {fmtPrice(Math.round(calc.down))} · Loan {fmtPrice(Math.round(calc.loan))}</div>
    </div>
  );
}
