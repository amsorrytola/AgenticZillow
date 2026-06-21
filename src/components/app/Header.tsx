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
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, justifySelf: "start" }}>
          {NAV.map((n) => <NavLink key={n.label} {...n} />)}
        </nav>
        <div style={{ justifySelf: "center" }}><Logo /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifySelf: "end" }}>
          <Link href="/sell" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Manage Rentals</Link>
          <Link href="/saved" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z" /></svg>
            Saved
          </Link>
          <Link href="/account" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Sign In</Link>
          <AskPill onClick={() => setOpen(true)} />
        </div>
      </div>
    </header>
  );
}
