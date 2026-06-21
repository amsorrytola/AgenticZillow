// AgenticZillow website footer — dense, utilitarian, Zillow-faithful.
function FootCol({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>{title}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
        {links.map((l) => (
          <li key={l}><a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function AZFooter() {
  const popular = [
    "Austin homes for sale", "Seattle apartments for rent", "Miami real estate", "Denver new construction",
    "Portland homes for sale", "Nashville apartments", "Phoenix real estate", "Chicago condos",
    "Boston homes for sale", "Atlanta apartments", "San Diego real estate", "Dallas new construction",
  ];
  return (
    <footer style={{ background: "#fff", borderTop: "1px solid var(--border-hairline)" }}>
      {/* popular searches */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Popular searches</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px 24px" }}>
          {popular.map((p) => <a key={p} href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>{p}</a>)}
        </div>
      </div>
      {/* link map */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(5, 1fr) 1.4fr", gap: 24 }}>
        <FootCol title="About" links={["About us", "Research", "Careers", "Investors", "Mobile apps"]} />
        <FootCol title="Discover" links={["AgenticZillow blog", "Affordability", "Find an agent", "Home loans", "Rent guide"]} />
        <FootCol title="Real estate" links={["Buy a home", "Sell a home", "New construction", "Foreclosures", "Open houses"]} />
        <FootCol title="Rentals" links={["Apartments for rent", "Houses for rent", "Manage rentals", "List a rental", "Renter hub"]} />
        <FootCol title="Help" links={["Help center", "Advertise", "Fair Housing", "Privacy", "Terms", "Do Not Sell"]} />
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <img src="../../assets/logo-mark.svg" width="24" height="24" alt="" />
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--blue-600)", letterSpacing: "-0.02em" }}>AgenticZillow</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: "20px" }}>Find it. Tour it. Own it — with a little help from your agents.</p>
        </div>
      </div>
      {/* legal */}
      <div style={{ background: "var(--surface-band)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, border: "1.5px solid var(--text-muted)", borderRadius: 3, fontSize: 9, fontWeight: 700, color: "var(--text-muted)" }}>EHO</div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, flex: 1, minWidth: 280, lineHeight: "16px" }}>
            © 2026 AgenticZillow. Equal Housing Opportunity. <strong style={{ fontWeight: 600 }}>AgenticZillow is a portfolio/demo clone for showcase purposes — not affiliated with Zillow Group. Listings and data are synthetic.</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
window.AZFooter = AZFooter;
