import Link from "next/link";

const POPULAR = [
  "Austin homes for sale", "Seattle apartments for rent", "Miami real estate", "Denver new construction",
  "New York condos", "Austin rentals", "Seattle homes for sale", "Miami apartments",
  "Denver real estate", "New York homes", "Austin condos", "Denver apartments",
];

const COLS: { title: string; links: string[] }[] = [
  { title: "About", links: ["About us", "Research", "Careers", "Investors", "Mobile apps"] },
  { title: "Discover", links: ["AgenticZillow blog", "Affordability", "Find an agent", "Home loans", "Rent guide"] },
  { title: "Real estate", links: ["Buy a home", "Sell a home", "New construction", "Foreclosures", "Open houses"] },
  { title: "Rentals", links: ["Apartments for rent", "Houses for rent", "Manage rentals", "List a rental", "Renter hub"] },
  { title: "Help", links: ["Help center", "Advertise", "Fair Housing", "Privacy", "Terms", "Do Not Sell"] },
];

export function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "1px solid var(--border-hairline)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Popular searches</div>
        <div className="az-grid-6">
          {POPULAR.map((p) => <Link key={p} href="/search" style={{ fontSize: 13, color: "var(--text-secondary)" }}>{p}</Link>)}
        </div>
      </div>
      <div className="az-foot-cols" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {COLS.map((c) => (
          <div key={c.title}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{c.title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
              {c.links.map((l) => <li key={l}><Link href="#" style={{ fontSize: 13, color: "var(--text-secondary)" }}>{l}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--blue-600)", letterSpacing: "-0.02em" }}>AgenticZillow</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: "20px" }}>Find it. Tour it. Own it — with a little help from your agents.</p>
        </div>
      </div>
      <div style={{ background: "var(--surface-band)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, border: "1.5px solid var(--text-muted)", borderRadius: 3, fontSize: 9, fontWeight: 700, color: "var(--text-muted)" }}>EHO</div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, flex: 1, minWidth: 280, lineHeight: "16px" }}>
            © 2026 AgenticZillow. Equal Housing Opportunity.{" "}
            <strong style={{ fontWeight: 600 }}>AgenticZillow is a portfolio/demo clone for showcase purposes — not affiliated with Zillow Group. Listings and data are synthetic.</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
