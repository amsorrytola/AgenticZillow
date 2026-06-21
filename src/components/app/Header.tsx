"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { AskPill } from "@/components/ds/agentic/AskPill.jsx";
import { useCopilot } from "./copilot";

const NAV: { label: string; href: string }[] = [
  { label: "Buy", href: "/search?transaction=buy" },
  { label: "Rent", href: "/search?transaction=rent" },
  { label: "Sell", href: "/sell" },
  { label: "Home Loans", href: "/home-loans" },
  { label: "Find an Agent", href: "/agents" },
];
const ACCOUNT: { label: string; href: string }[] = [
  { label: "Manage Rentals", href: "/sell" },
  { label: "Saved", href: "/saved" },
  { label: "Sign In", href: "/account" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        textDecoration: "none", fontSize: 14, fontWeight: 500,
        color: h ? "var(--blue-600)" : "var(--text-primary)",
        display: "inline-flex", alignItems: "center", gap: 3, padding: "8px 4px",
      }}
    >
      {label}
      <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
    </Link>
  );
}

export function Header() {
  const { setOpen } = useCopilot();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 1000, background: "#fff",
        borderBottom: "1px solid var(--border-hairline)",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        height: 60, display: "flex", alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        {/* left: desktop nav OR mobile hamburger */}
        <div style={{ justifySelf: "start" }}>
          <nav className="az-desktop-only" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {NAV.map((n) => <NavLink key={n.label} {...n} />)}
          </nav>
          <button
            className="az-mobile-only"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, color: "var(--text-primary)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>

        <div style={{ justifySelf: "center" }}><Logo /></div>

        {/* right: desktop cluster OR mobile ask pill */}
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 14 }}>
          <div className="az-desktop-only" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {ACCOUNT.map((a) => (
              <Link key={a.label} href={a.href} style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                {a.label === "Saved" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z" /></svg>}
                {a.label}
              </Link>
            ))}
          </div>
          <AskPill onClick={() => setOpen(true)} style={{ height: 36, padding: "0 12px", fontSize: 13 }} />
        </div>
      </div>

      {/* mobile dropdown menu */}
      {menuOpen && (
        <div className="az-mobile-only" style={{ position: "absolute", top: 60, left: 0, right: 0, background: "#fff", borderBottom: "1px solid var(--border-hairline)", boxShadow: "var(--shadow-lg)", flexDirection: "column", padding: 8, zIndex: 1000 }}>
          {[...NAV, ...ACCOUNT].map((n) => (
            <Link key={n.label} href={n.href} onClick={() => setMenuOpen(false)} style={{ padding: "12px 14px", fontSize: 15, fontWeight: 500, color: "var(--text-primary)", borderRadius: 8 }}>{n.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
