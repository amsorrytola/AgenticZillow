import Link from "next/link";
import { notFound } from "next/navigation";
import { repo } from "@/lib/data/repository";
import { fmtPrice, fmtSqft, fullAddress, metaLine, statusLabel } from "@/lib/format";
import { ListingGallery } from "@/components/app/ListingGallery";
import { InlineAIActions } from "@/components/app/InlineAIActions";
import { MortgageWidget } from "@/components/app/MortgageWidget";
import { PropertyMap } from "@/components/app/PropertyMap";
import { SaveButton } from "@/components/app/SaveButton";
import { ListingCard } from "@/components/app/ListingCard";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import { RequestTourButton } from "@/components/app/RequestTourButton";

export const dynamic = "force-dynamic";

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div>
    </div>
  );
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = await repo.getListing(id);
  if (!l) notFound();
  const similar = await repo.similar(l.id, 4);
  const deltaPct = ((l.price - l.zestimate) / l.zestimate) * 100;

  const facts: [string, string][] = [
    ["Type", l.homeType],
    ["Year built", String(l.yearBuilt)],
    ["Lot", l.lotSqft ? `${fmtSqft(l.lotSqft)} sqft` : "—"],
    ["Price/sqft", `$${l.pricePerSqft}`],
    ["HOA", l.hoa ? `${fmtPrice(l.hoa)}/mo` : "None"],
    ["Days on market", String(l.daysOnMarket)],
    ["Walk Score", String(l.walkScore)],
    ["Status", statusLabel(l.status)],
  ];

  return (
    <div>
      <CopilotContext page="listing" listingId={l.id} metroId={l.metroId} greeting={`You're viewing ${l.address.line1}. Ask me if it's a good deal, the neighborhood, your monthly payment, or to schedule a tour.`} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}>
        <Link href="/search" style={{ fontSize: 13, color: "var(--blue-600)", fontWeight: 600 }}>← Back to results</Link>
      </div>

      {/* Hero: gallery + summary */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, alignItems: "start" }}>
        <ListingGallery photos={l.photos} alt={fullAddress(l)} />
        <div style={{ position: "sticky", top: 76 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} /> {statusLabel(l.status)}
          </div>
          <div className="az-price" style={{ fontSize: 34, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtPrice(l.price, l.transaction)}</div>
          <div className="az-stat" style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 4 }}>{metaLine(l)}</div>
          <div style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 4 }}>{fullAddress(l)}</div>
          {l.priceCut && <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: "var(--price-cut)" }}>↓ ${l.priceCut.amount.toLocaleString()} ({l.priceCut.date})</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <RequestTourButton />
            <SaveButton id={l.id} />
          </div>

          <div style={{ marginTop: 16, padding: 16, background: "var(--blue-50)", borderRadius: 12 }}>
            <div className="az-eyebrow" style={{ marginBottom: 8 }}>✦ AgenticZillow estimate</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{fmtPrice(l.zestimate)}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: deltaPct <= 0 ? "var(--success)" : "var(--text-muted)" }}>
                Listed {deltaPct >= 0 ? `${deltaPct.toFixed(1)}% above` : `${Math.abs(deltaPct).toFixed(1)}% below`} estimate
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>Rent estimate {fmtPrice(l.rentZestimate)}/mo</div>
          </div>
        </div>
      </div>

      {/* inline AI */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px" }}>
        <InlineAIActions />
      </div>

      {/* main two-column */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "8px 24px 40px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>Overview</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: "24px", margin: 0 }}>{l.description}</p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Facts & features</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
              {facts.map(([k, v]) => <Stat key={k} k={k} v={v} />)}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {l.features.map((f) => <span key={f} style={{ fontSize: 13, color: "var(--text-secondary)", background: "var(--surface-band)", borderRadius: 9999, padding: "5px 12px" }}>{f}</span>)}
            </div>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Price & tax history</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                {(l.priceCut
                  ? [["May 2, 2026", "Price change", fmtPrice(l.price)], ["Listed", "Listed for sale", fmtPrice(l.price + l.priceCut.amount)]]
                  : [["Listed", "Listed for sale", fmtPrice(l.price)]]
                ).map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                    {row.map((c, j) => <td key={j} style={{ padding: "10px 0", color: j === 2 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 2 ? 600 : 400, textAlign: j === 2 ? "right" : "left" }}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Schools</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Elementary", "Middle", "High"].map((lvl, i) => (
                <div key={lvl} style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid var(--border-hairline)", borderRadius: 10, padding: "10px 14px" }}>
                  <span style={{ width: 34, height: 34, borderRadius: 8, background: "var(--success-fill)", color: "var(--success)", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{Math.max(1, l.schoolRating - i)}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{l.neighborhood} {lvl} School</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lvl} · Public · Rating {Math.max(1, l.schoolRating - i)}/10</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Location</h2>
            <div style={{ height: 320, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-hairline)" }}>
              <PropertyMap listings={[l]} center={{ lat: l.lat, lng: l.lng }} zoom={14} activeId={l.id} />
            </div>
          </section>
        </div>

        {/* right rail */}
        <div style={{ position: "sticky", top: 76, display: "flex", flexDirection: "column", gap: 16 }}>
          <MortgageWidget price={l.price} hoa={l.hoa ?? 0} />
          <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700 }}>Tour this home</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 12px" }}>Pick a time — our Tour Concierge will coordinate. It's free, with no obligation.</p>
            <RequestTourButton block />
          </div>
        </div>
      </div>

      {/* similar */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px" }}>Similar homes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {similar.map((s) => <ListingCard key={s.id} l={s} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
}
