import Link from "next/link";
import { repo } from "@/lib/data/repository";
import { ListingCard } from "@/components/app/ListingCard";
import { HeroSearch } from "@/components/app/HeroSearch";
import { ProactiveStrip } from "@/components/app/ProactiveStrip";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import { HERO_PHOTO, HOME_VALUE_PHOTO } from "@/lib/data/photos";

export const dynamic = "force-dynamic";

const TILES = [
  { img: "🔍", title: "Buy a home", body: "Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.", cta: "Browse homes", href: "/search?transaction=buy" },
  { img: "🔑", title: "Sell a home", body: "No matter what path you take to sell your home, we can help you navigate a successful sale.", cta: "See your options", href: "/sell" },
  { img: "🏘️", title: "Rent a home", body: "We're creating a seamless online experience — from shopping to applying to paying rent.", cta: "Find rentals", href: "/search?transaction=rent" },
];

export default async function HomePage() {
  const { listings } = await repo.search({ transaction: "buy", sort: "relevance", limit: 8 });

  return (
    <div>
      <CopilotContext page="home" greeting="You're on the home page — want me to find homes, value yours, or check what you can afford?" />

      {/* Hero */}
      <section style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={HERO_PHOTO} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 760, padding: "0 24px" }}>
          <h1 className="az-hero-h1" style={{ color: "#fff", fontSize: 46, lineHeight: "52px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em", textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>Agents. Tours. Loans. Homes.</h1>
          <p style={{ color: "#fff", fontSize: 17, margin: "12px 0 28px", opacity: 0.95 }}>Find it. Tour it. Own it — with a little help.</p>
          <HeroSearch />
        </div>
      </section>

      <ProactiveStrip />

      {/* Buy/Rent/Sell tiles */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 8px" }}>
        <div className="az-grid-3">
          {TILES.map((t) => (
            <Link key={t.title} href={t.href} style={{ textDecoration: "none", background: "#fff", border: "1px solid var(--border-hairline)", borderRadius: 12, padding: 28, textAlign: "center", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--blue-50)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{t.img}</div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{t.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: "20px" }}>{t.body}</p>
              <span style={{ marginTop: 4, display: "inline-flex", height: 40, padding: "0 20px", alignItems: "center", borderRadius: 8, border: "1px solid var(--blue-600)", color: "var(--blue-600)", fontSize: 14, fontWeight: 600 }}>{t.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Homes for you */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Homes for you</h2>
          <Link href="/search" style={{ fontSize: 14, fontWeight: 600, color: "var(--blue-600)" }}>See all →</Link>
        </div>
        <div className="az-grid-4">
          {listings.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      {/* Home value feature band */}
      <section style={{ background: "var(--blue-50)" }}>
        <div className="az-two-eq" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>
          <div>
            <h2 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 700 }}>How much is your home worth?</h2>
            <p style={{ margin: "0 0 20px", fontSize: 16, color: "var(--text-secondary)", lineHeight: "24px" }}>Get an instant AI-powered estimate, then let the Market agent walk you through the comps behind it.</p>
            <Link href="/home-loans" style={{ display: "inline-flex", height: 44, padding: "0 24px", alignItems: "center", borderRadius: 8, background: "var(--blue-600)", color: "#fff", fontSize: 14, fontWeight: 600 }}>Get estimate</Link>
          </div>
          <img src={HOME_VALUE_PHOTO} alt="" style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 12, boxShadow: "var(--shadow-md)" }} />
        </div>
      </section>

      {/* Blue conversion band */}
      <section style={{ background: "var(--blue-600)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 28, fontWeight: 700, color: "#fff" }}>Ready to find your next home?</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/search" style={{ height: 48, padding: "0 28px", display: "inline-flex", alignItems: "center", borderRadius: 9999, background: "#fff", color: "var(--blue-600)", fontSize: 16, fontWeight: 600 }}>Start your search</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
