"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSaved } from "@/components/app/saved-store";
import { ListingCard } from "@/components/app/ListingCard";
import { CopilotContext } from "@/components/app/CopilotContext";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { useCopilot } from "@/components/app/copilot";
import type { Listing } from "@/lib/domain/types";

export default function SavedPage() {
  const { ids } = useSaved();
  const { ask } = useCopilot();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const key = ids.join(",");

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/listings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids }) });
      const d = await res.json();
      if (on) {
        setListings(d.listings);
        setLoading(false);
      }
    })();
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div style={{ minHeight: "60vh" }}>
      <CopilotContext page="saved" greeting="These are your saved homes. Want me to compare them, analyze the best deal, or find more like these?" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Your saved homes</h1>
          {listings.length >= 2 && <Link href="/compare" style={{ fontSize: 14, fontWeight: 600, color: "var(--blue-600)" }}>Compare {listings.length} →</Link>}
        </div>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Collections, saved searches and price-drop alerts live here.</p>

        {!loading && listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <p>No saved homes yet — tap the ♥ on any listing.</p>
            <Link href="/search"><Button>Browse homes</Button></Link>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, margin: "16px 0 24px" }}>
              <Button variant="agentic" pill iconLeft={<span>✦</span>} onClick={() => ask("Analyze my saved homes and tell me the best deal")}>Analyze my saved homes</Button>
              <Link href="/compare"><Button variant="secondary">Compare</Button></Link>
            </div>
            <div className="az-grid-4">
              {listings.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
