"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSaved } from "@/components/app/saved-store";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { useCopilot } from "@/components/app/copilot";
import { fmtPrice, fmtSqft, fullAddress, statusLabel } from "@/lib/format";
import type { Listing } from "@/lib/domain/types";

const ROWS: { label: string; get: (l: Listing) => string }[] = [
  { label: "Price", get: (l) => fmtPrice(l.price, l.transaction) },
  { label: "AI estimate", get: (l) => fmtPrice(l.zestimate) },
  { label: "Beds", get: (l) => String(l.beds) },
  { label: "Baths", get: (l) => String(l.baths) },
  { label: "Sqft", get: (l) => fmtSqft(l.sqft) },
  { label: "$/sqft", get: (l) => `$${l.pricePerSqft}` },
  { label: "Year built", get: (l) => String(l.yearBuilt) },
  { label: "Home type", get: (l) => l.homeType },
  { label: "HOA", get: (l) => (l.hoa ? `${fmtPrice(l.hoa)}/mo` : "None") },
  { label: "Walk Score", get: (l) => String(l.walkScore) },
  { label: "Schools", get: (l) => `${l.schoolRating}/10` },
  { label: "Est. rent", get: (l) => `${fmtPrice(l.estMonthlyRent)}/mo` },
  { label: "Cap rate", get: (l) => `${l.capRate}%` },
  { label: "Status", get: (l) => statusLabel(l.status) },
];

export default function ComparePage() {
  const { ids } = useSaved();
  const { ask } = useCopilot();
  const [listings, setListings] = useState<Listing[]>([]);
  const key = ids.join(",");

  useEffect(() => {
    let on = true;
    (async () => {
      const res = await fetch("/api/listings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: ids.slice(0, 4) }) });
      const d = await res.json();
      if (on) setListings(d.listings);
    })();
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div style={{ minHeight: "60vh" }}>
      <CopilotContext page="compare" greeting="Comparing your saved homes — want me to rank them by value or analyze which is the best deal?" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 6px" }}>Compare homes</h1>
        {listings.length < 2 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <p>Save at least 2 homes to compare them side by side.</p>
            <Link href="/search"><Button>Browse homes</Button></Link>
          </div>
        ) : (
          <>
            <div style={{ margin: "12px 0 20px" }}>
              <Button variant="agentic" pill iconLeft={<span>✦</span>} onClick={() => ask("Compare my saved homes and recommend the best one with reasons")}>Ask the agent to recommend the best</Button>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid var(--border-hairline)", borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ position: "sticky", left: 0, background: "#fff", padding: 14, textAlign: "left", borderBottom: "1px solid var(--border-hairline)" }} />
                    {listings.map((l) => (
                      <th key={l.id} style={{ padding: 14, borderBottom: "1px solid var(--border-hairline)", minWidth: 180, textAlign: "left" }}>
                        <Link href={`/homes/${l.id}`} style={{ textDecoration: "none" }}>
                          <img src={l.photos[0]} alt="" style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8 }} />
                          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: "var(--text-primary)" }}>{fullAddress(l)}</div>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, i) => (
                    <tr key={row.label} style={{ background: i % 2 ? "var(--surface-zebra)" : "#fff" }}>
                      <td style={{ position: "sticky", left: 0, background: "inherit", padding: "10px 14px", fontWeight: 600, color: "var(--text-muted)" }}>{row.label}</td>
                      {listings.map((l) => <td key={l.id} style={{ padding: "10px 14px", fontVariantNumeric: "tabular-nums" }}>{row.get(l)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
