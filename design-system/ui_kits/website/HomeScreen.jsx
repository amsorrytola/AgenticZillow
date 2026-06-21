// AgenticZillow home / landing screen.
const { Button, PropertyCard, AskPill } = window.AgenticZillowDesignSystem_f8327a;

const HERO_BG = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80";

const LISTINGS = [
  { photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80", status: "for-sale", price: "$625,000", beds: 4, baths: 3, sqft: "2,150", homeType: "House", address: "1234 Pearl St, Austin, TX 78701", photoCount: "1/24", attribution: "Listing by Lone Star Realty" },
  { photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", status: "new", price: "$489,000", beds: 3, baths: 2, sqft: "1,640", homeType: "House", address: "88 Maple Ave, Austin, TX 78704", photoCount: "1/31", attribution: "Listing by Hill Country Homes" },
  { photo: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80", status: "tour", price: "$742,500", beds: 4, baths: 3, sqft: "2,480", homeType: "House", address: "5601 Bluebonnet Ln, Austin, TX 78745", photoCount: "1/18", attribution: "Listing by Capital Realty", priceCut: "$15,000 (May 2)" },
  { photo: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80", status: "pending", price: "$398,000", beds: 2, baths: 2, sqft: "1,180", homeType: "Condo", address: "201 Lavaca St #1408, Austin, TX 78701", photoCount: "1/27", attribution: "Listing by Urban Living Co." },
];

function Tile({ img, title, body, cta }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: "#fff", border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 28, textAlign: "center",
        boxShadow: h ? "var(--shadow-md)" : "var(--shadow-sm)", transform: h ? "translateY(-3px)" : "none",
        transition: "box-shadow .18s, transform .18s", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--blue-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 44 }}>{img}</span>
      </div>
      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: "20px" }}>{body}</p>
      <Button variant="secondary" style={{ marginTop: 4 }}>{cta}</Button>
    </div>
  );
}

function ProactiveStrip() {
  const items = [
    { tag: "3 new matches", label: "near your saved search “Austin · 3+ bd”" },
    { tag: "Price drop", label: "$15k off a home in your Dream homes collection" },
    { tag: "Below Zestimate", label: "a new listing priced 3% under estimate" },
  ];
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-muted)" }}>✦ From your agent</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map((it) => (
          <div key={it.tag} style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 16, background: "#fff", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--blue-600)" }}>{it.tag}</span>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: "18px" }}>{it.label}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" variant="ghost">Shortlist</Button>
              <Button size="sm" variant="ghost">Analyze</Button>
              <Button size="sm" variant="text">Dismiss</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeScreen() {
  const [q, setQ] = React.useState("");
  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={HERO_BG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 720, padding: "0 24px" }}>
          <h1 style={{ color: "#fff", fontSize: 46, lineHeight: "52px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em", textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>Agents. Tours. Loans. Homes.</h1>
          <p style={{ color: "#fff", fontSize: 17, margin: "12px 0 28px", opacity: 0.95 }}>Find it. Tour it. Own it — with a little help.</p>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 9999, boxShadow: "var(--shadow-lg)", padding: "6px 6px 6px 22px", maxWidth: 640, margin: "0 auto" }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter an address, neighborhood, city, or ZIP code"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "var(--font-sans)", color: "var(--text-primary)", background: "transparent" }} />
            <button aria-label="Search" style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: "var(--blue-600)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            {["🏡 Find me a home", "💰 What can I afford?", "🖼️ Search by photo"].map((c) => (
              <span key={c} style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 9999, padding: "7px 14px", backdropFilter: "blur(4px)", cursor: "pointer" }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <ProactiveStrip />

      {/* Buy/Rent/Sell tiles */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          <Tile img="🔍" title="Buy a home" body="Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else." cta="Browse homes" />
          <Tile img="🔑" title="Sell a home" body="No matter what path you take to sell your home, we can help you navigate a successful sale." cta="See your options" />
          <Tile img="🏘️" title="Rent a home" body="We're creating a seamless online experience — from shopping to applying to paying rent." cta="Find rentals" />
        </div>
      </section>

      {/* Homes for you carousel */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>Homes for you</h2>
          <a href="#" style={{ fontSize: 14, fontWeight: 600, color: "var(--blue-600)" }}>See all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {LISTINGS.map((l, i) => <PropertyCard key={i} {...l} />)}
        </div>
      </section>

      {/* Feature band */}
      <section style={{ background: "var(--blue-50)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h2 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>How much is your home worth?</h2>
            <p style={{ margin: "0 0 20px", fontSize: 16, color: "var(--text-secondary)", lineHeight: "24px" }}>Get an instant AI-powered estimate, then let the Pricing agent walk you through the comps behind it.</p>
            <div style={{ display: "flex", gap: 10, maxWidth: 460 }}>
              <input placeholder="Enter your home address" style={{ flex: 1, height: 44, borderRadius: 8, border: "1px solid var(--border-default)", padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
              <Button>Get estimate</Button>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="" style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 12, boxShadow: "var(--shadow-md)" }} />
        </div>
      </section>

      {/* Blue conversion band */}
      <section style={{ background: "var(--blue-600)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 28, fontWeight: 700, color: "#fff" }}>Ready to find your next home?</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button style={{ height: 48, padding: "0 28px", borderRadius: 9999, border: "none", background: "#fff", color: "var(--blue-600)", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Start your search</button>
            <button style={{ height: 48, padding: "0 28px", borderRadius: 9999, border: "1.5px solid rgba(255,255,255,0.7)", background: "transparent", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 7 }}>✦ Talk to AgenticZillow</button>
          </div>
        </div>
      </section>
    </div>
  );
}
window.HomeScreen = HomeScreen;
