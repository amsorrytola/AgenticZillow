// AgenticZillow search results — sticky filter bar + map/list split.
const { Button, FilterPill, Select, PropertyCard, PriceBubble } = window.AgenticZillowDesignSystem_f8327a;

const RESULTS = [
  { photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80", status: "for-sale", price: "$625,000", beds: 4, baths: 3, sqft: "2,150", homeType: "House", address: "1234 Pearl St, Austin, TX 78701", photoCount: "1/24", attribution: "Lone Star Realty", _pin: "$625K", _x: 24, _y: 30 },
  { photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", status: "new", price: "$489,000", beds: 3, baths: 2, sqft: "1,640", homeType: "House", address: "88 Maple Ave, Austin, TX 78704", photoCount: "1/31", attribution: "Hill Country Homes", _pin: "$489K", _x: 52, _y: 48, _state: "viewed" },
  { photo: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80", status: "tour", price: "$742,500", beds: 4, baths: 3, sqft: "2,480", homeType: "House", address: "5601 Bluebonnet Ln, Austin, TX 78745", photoCount: "1/18", attribution: "Capital Realty", priceCut: "$15,000 (May 2)", _pin: "$742K", _x: 38, _y: 64 },
  { photo: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80", status: "pending", price: "$398,000", beds: 2, baths: 2, sqft: "1,180", homeType: "Condo", address: "201 Lavaca St #1408, Austin, TX 78701", photoCount: "1/27", attribution: "Urban Living Co.", _pin: "$398K", _x: 68, _y: 26, _state: "saved" },
  { photo: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80", status: "for-sale", price: "$555,000", beds: 3, baths: 2, sqft: "1,920", homeType: "House", address: "4410 Avenue G, Austin, TX 78751", photoCount: "1/22", attribution: "Bramlett Residential", _pin: "$555K", _x: 16, _y: 58 },
  { photo: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80", status: "for-sale", price: "$689,000", beds: 4, baths: 3, sqft: "2,310", homeType: "House", address: "907 W 9th St, Austin, TX 78703", photoCount: "1/40", attribution: "Moreland Properties", _pin: "$689K", _x: 80, _y: 56, _state: "shortlisted" },
];

function MapPane() {
  return (
    <div style={{ position: "relative", height: "100%", background: "#EAEFF2", overflow: "hidden" }}>
      {/* faux low-sat basemap */}
      <div style={{ position: "absolute", inset: 0, background:
        "linear-gradient(180deg,#F4F4F6,#EDEFF2)" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
        <path d="M-10,120 C200,90 320,200 520,160 S800,120 920,180" stroke="#DCE6EF" strokeWidth="34" fill="none" />
        <path d="M120,-20 C160,160 90,320 200,520" stroke="#DCE6EF" strokeWidth="22" fill="none" />
        <path d="M0,300 H960" stroke="#E2E2E6" strokeWidth="2" fill="none" />
        <path d="M400,0 V600" stroke="#E2E2E6" strokeWidth="2" fill="none" />
      </svg>
      {/* controls */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 8, padding: "8px 12px", boxShadow: "var(--shadow-sm)", fontSize: 13, fontWeight: 500 }}>
        <span style={{ width: 32, height: 18, borderRadius: 9999, background: "var(--blue-600)", position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#fff" }} />
        </span>
        Search as I move the map
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
        {["Schools", "Transit", "Climate"].map((l) => (
          <span key={l} style={{ background: "#fff", borderRadius: 9999, padding: "6px 12px", fontSize: 12, fontWeight: 600, boxShadow: "var(--shadow-xs)", cursor: "pointer" }}>{l}</span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 12, bottom: 12, background: "#fff", borderRadius: 8, padding: "8px 12px", boxShadow: "var(--shadow-sm)", fontSize: 13, fontWeight: 600, display: "inline-flex", gap: 6, cursor: "pointer" }}>
        ✎ Draw
      </div>
      {/* pins */}
      {RESULTS.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: r._x + "%", top: r._y + "%", transform: "translate(-50%,-100%)" }}>
          <PriceBubble price={r._pin} state={r._state} />
        </div>
      ))}
    </div>
  );
}

function SearchScreen() {
  const [sort, setSort] = React.useState("Homes for You");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      {/* filter bar */}
      <div style={{ borderBottom: "1px solid var(--border-hairline)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "#fff" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--border-default)", borderRadius: 8, padding: "0 12px", height: 40, minWidth: 240 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input defaultValue="Austin, TX" style={{ border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", width: 120 }} />
        </div>
        <FilterPill label="For Sale" />
        <FilterPill label="Price" />
        <FilterPill label="Beds & Baths" />
        <FilterPill label="Home Type" applied count={2} />
        <FilterPill label="More" />
        <Button size="sm" variant="primary">Save search</Button>
        <Button size="sm" variant="agentic" pill style={{ height: 36 }} iconLeft={<span>✦</span>}>Ask AI</Button>
      </div>

      {/* split */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "58% 42%", minHeight: 0 }}>
        <MapPane />
        {/* list pane */}
        <div style={{ overflowY: "auto", borderLeft: "1px solid var(--border-hairline)", padding: 24 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>Austin, TX Real Estate &amp; Homes for Sale</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>1,284 results</span>
            <Select value={sort} onChange={setSort} options={["Homes for You", "Price (High to Low)", "Newest", "AI: Best match for me", "AI: Best deal"]} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {["Houses ✕", "Condos ✕", "Applied by AI: ≤ 30-min commute ✕"].map((c) => (
              <span key={c} style={{ fontSize: 12, fontWeight: 600, color: "var(--blue-600)", background: "var(--blue-100)", borderRadius: 9999, padding: "5px 11px", cursor: "pointer" }}>{c}</span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {RESULTS.map((r, i) => <PropertyCard key={i} {...r} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
window.SearchScreen = SearchScreen;
