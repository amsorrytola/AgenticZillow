import { repo } from "@/lib/data/repository";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import type { AgentProfile } from "@/lib/domain/types";

export const dynamic = "force-dynamic";

function ProCard({ a }: { a: AgentProfile }) {
  return (
    <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 20, background: "#fff", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
        <img src={a.photo} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{a.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{a.title} · {a.brokerage}</div>
          <div style={{ fontSize: 13, color: "var(--warning)", fontWeight: 600, marginTop: 2 }}>★ {a.rating} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({a.reviews} reviews)</span></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {a.specialties.map((s) => <span key={s} style={{ fontSize: 12, color: "var(--blue-600)", background: "var(--blue-100)", borderRadius: 9999, padding: "4px 10px" }}>{s}</span>)}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: "19px", margin: "0 0 12px" }}>{a.bio}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
        <span style={{ color: "var(--text-muted)" }}>{a.sales} sales · {a.priceRange}</span>
        <span style={{ color: "var(--blue-600)", fontWeight: 600 }}>{a.phone}</span>
      </div>
    </div>
  );
}

export default async function AgentsPage() {
  const agents = await repo.agents({ kind: "agent" });
  const lenders = await repo.agents({ kind: "lender" });

  return (
    <div>
      <CopilotContext page="agents" greeting="Looking for an agent or lender? Tell me your city and what you're buying and I'll match you." />
      <section style={{ background: "var(--blue-50)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>Find a local expert</h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>Top-rated agents and lenders across our markets — vetted, reviewed, and ready to help.</p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px" }}>Real estate agents</h2>
        <div className="az-grid-3">
          {agents.map((a) => <ProCard key={a.id} a={a} />)}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "36px 0 16px" }}>Lenders</h2>
        <div className="az-grid-3">
          {lenders.map((a) => <ProCard key={a.id} a={a} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
