"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterPill } from "@/components/ds/forms/FilterPill.jsx";
import { Select } from "@/components/ds/forms/Select.jsx";
import { Button } from "@/components/ds/buttons/Button.jsx";
import { ListingCard } from "./ListingCard";
import { PropertyMap } from "./PropertyMap";
import { CopilotContext } from "./CopilotContext";
import { useCopilot } from "./copilot";
import { useSaved } from "./saved-store";
import { parseQuery } from "@/lib/agents/nlu";
import { METRO_BY_ID, DEFAULT_METRO } from "@/lib/data/metros";
import { fmtPriceShort } from "@/lib/format";
import type { HomeType, SearchFilters, SearchResult, SortKey } from "@/lib/domain/types";

const HOME_TYPES: HomeType[] = ["House", "Condo", "Townhouse", "Multi-family", "Apartment"];
const PRICE_STEPS = [0, 100000, 200000, 300000, 400000, 500000, 650000, 800000, 1000000, 1500000, 2000000];
const SORTS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Homes for You" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "newest", label: "Newest" },
  { value: "ai-match", label: "✦ AI: Best match for me" },
  { value: "ai-deal", label: "✦ AI: Best deal" },
];
const TX_LABEL: Record<string, string> = { buy: "For Sale", rent: "For Rent", sold: "Sold" };

export function SearchClient() {
  const sp = useSearchParams();
  const { setOpen, ask } = useCopilot();
  const { ids: savedIds } = useSaved();

  const [filters, setFilters] = useState<SearchFilters>({ transaction: "buy" });
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pop, setPop] = useState<string | null>(null);
  const [locationText, setLocationText] = useState("");
  const [savedSearch, setSavedSearch] = useState(false);
  const didInit = useRef(false);

  async function runSearch(f: SearchFilters) {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(f),
      });
      const data: SearchResult = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  // initial load from URL
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const q = sp.get("q") ?? "";
    const base: SearchFilters = q ? parseQuery(q).filters : {};
    const tx = sp.get("transaction");
    if (tx) base.transaction = tx as SearchFilters["transaction"];
    if (!base.transaction) base.transaction = "buy";
    const metroId = sp.get("metroId");
    if (metroId) base.metroId = metroId;
    setFilters(base);
    setLocationText(q || (base.metroId ? `${METRO_BY_ID[base.metroId]?.city}, ${METRO_BY_ID[base.metroId]?.state}` : ""));
    runSearch(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<SearchFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    setSavedSearch(false);
    runSearch(next);
  };

  const metro = (filters.metroId && METRO_BY_ID[filters.metroId]) || DEFAULT_METRO;
  const center = { lat: metro.lat, lng: metro.lng };
  const listings = result?.listings ?? [];
  const typeCount = filters.homeTypes?.length ?? 0;

  const submitLocation = () => {
    const parsed = parseQuery(locationText);
    update({ ...parsed.filters, transaction: filters.transaction });
  };

  const headerTitle = useMemo(() => {
    const city = metro.city;
    return `${city}, ${metro.state} ${filters.transaction === "rent" ? "Apartments for Rent" : "Real Estate & Homes for Sale"}`;
  }, [metro, filters.transaction]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      <CopilotContext page="search" metroId={metro.id} greeting={`You're searching ${metro.city}. Want me to refine these results, shortlist the best, or analyze a deal?`} />

      {/* filter bar */}
      <div style={{ borderBottom: "1px solid var(--border-hairline)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "#fff", position: "relative", zIndex: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--border-default)", borderRadius: 8, padding: "0 12px", height: 40, minWidth: 240 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input value={locationText} onChange={(e) => setLocationText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitLocation(); }} placeholder="Address, neighborhood, city" style={{ border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", width: 200 }} />
        </div>

        {/* transaction segmented */}
        <FilterMenu label={TX_LABEL[filters.transaction ?? "buy"]} applied openKey="tx" pop={pop} setPop={setPop}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
            {(["buy", "rent", "sold"] as const).map((t) => (
              <MenuItem key={t} active={filters.transaction === t} onClick={() => { update({ transaction: t }); setPop(null); }}>{TX_LABEL[t]}</MenuItem>
            ))}
          </div>
        </FilterMenu>

        {/* price */}
        <FilterMenu label={priceLabel(filters)} applied={filters.minPrice != null || filters.maxPrice != null} openKey="price" pop={pop} setPop={setPop}>
          <div style={{ display: "flex", gap: 12, minWidth: 280 }}>
            <PriceCol title="Min" value={filters.minPrice} onPick={(v) => update({ minPrice: v })} />
            <PriceCol title="Max" value={filters.maxPrice} onPick={(v) => update({ maxPrice: v })} max />
          </div>
        </FilterMenu>

        {/* beds */}
        <FilterMenu label={filters.beds ? `${filters.beds}+ bd` : "Beds"} applied={filters.beds != null} openKey="beds" pop={pop} setPop={setPop}>
          <div style={{ display: "flex", gap: 6, minWidth: 220, flexWrap: "wrap" }}>
            {[undefined, 1, 2, 3, 4, 5].map((b) => (
              <MenuItem key={String(b)} pill active={filters.beds === b} onClick={() => { update({ beds: b }); setPop(null); }}>{b == null ? "Any" : `${b}+`}</MenuItem>
            ))}
          </div>
        </FilterMenu>

        {/* home type */}
        <FilterMenu label="Home Type" applied={typeCount > 0} count={typeCount || undefined} openKey="type" pop={pop} setPop={setPop}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
            {HOME_TYPES.map((t) => {
              const on = filters.homeTypes?.includes(t);
              return (
                <MenuItem key={t} active={on} onClick={() => {
                  const cur = new Set(filters.homeTypes ?? []);
                  on ? cur.delete(t) : cur.add(t);
                  update({ homeTypes: cur.size ? Array.from(cur) : undefined });
                }}>{on ? "☑ " : "☐ "}{t}</MenuItem>
              );
            })}
          </div>
        </FilterMenu>

        <Button size="sm" variant={savedSearch ? "secondary" : "primary"} onClick={() => setSavedSearch(true)}>{savedSearch ? "Saved ✓" : "Save search"}</Button>
        <Button size="sm" variant="agentic" pill iconLeft={<span>✦</span>} onClick={() => setOpen(true)}>Ask AI</Button>
      </div>

      {/* split */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "58% 42%", minHeight: 0 }}>
        <div style={{ position: "relative", height: "100%" }}>
          <PropertyMap listings={listings} center={center} zoom={metro.zoom} activeId={activeId} savedIds={savedIds} onActivate={setActiveId} />
        </div>

        <div style={{ overflowY: "auto", borderLeft: "1px solid var(--border-hairline)", padding: 24 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>{headerTitle}</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {loading ? "Searching…" : `${(result?.total ?? 0).toLocaleString()} results`}
            </span>
            <Select value={filters.sort ?? "relevance"} options={SORTS} onChange={(v: string) => update({ sort: v as SortKey })} />
          </div>

          {/* applied chips */}
          {result && result.appliedChips.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {result.appliedChips.map((c, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, color: "var(--blue-600)", background: "var(--blue-100)", borderRadius: 9999, padding: "5px 11px", display: "inline-flex", gap: 5, alignItems: "center" }}>
                  {c.byAI && <span style={{ opacity: 0.8 }}>✦ Applied by AI:</span>}{c.label}
                </span>
              ))}
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
              No homes match. <button onClick={() => ask("Loosen my filters and find similar homes")} style={{ color: "var(--blue-600)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Ask the agent to broaden the search →</button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {listings.map((l) => (
              <div key={l.id} onMouseEnter={() => setActiveId(l.id)} onMouseLeave={() => setActiveId(null)} style={{ borderRadius: 8, outline: activeId === l.id ? "2px solid var(--blue-600)" : "none", outlineOffset: 2 }}>
                <ListingCard l={l} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function priceLabel(f: SearchFilters): string {
  if (f.minPrice && f.maxPrice) return `${fmtPriceShort(f.minPrice)}–${fmtPriceShort(f.maxPrice)}`;
  if (f.maxPrice) return `≤ ${fmtPriceShort(f.maxPrice)}`;
  if (f.minPrice) return `≥ ${fmtPriceShort(f.minPrice)}`;
  return "Price";
}

function PriceCol({ title, value, onPick, max }: { title: string; value?: number; onPick: (v: number | undefined) => void; max?: boolean }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--text-muted)" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 220, overflowY: "auto" }}>
        <MenuItem active={value == null} onClick={() => onPick(undefined)}>No {title}</MenuItem>
        {PRICE_STEPS.filter((p) => p > 0).map((p) => (
          <MenuItem key={p} active={value === p} onClick={() => onPick(p)}>{fmtPriceShort(p)}{max ? "" : "+"}</MenuItem>
        ))}
      </div>
    </div>
  );
}

function FilterMenu({ label, applied, count, openKey, pop, setPop, children }: { label: string; applied?: boolean; count?: number; openKey: string; pop: string | null; setPop: (s: string | null) => void; children: React.ReactNode }) {
  const open = pop === openKey;
  return (
    <div style={{ position: "relative" }}>
      <FilterPill label={label} applied={applied} count={count} open={open} onClick={() => setPop(open ? null : openKey)} />
      {open && (
        <>
          <div onClick={() => setPop(null)} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", border: "1px solid var(--border-hairline)", borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 14, zIndex: 40 }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ children, active, onClick, pill }: { children: React.ReactNode; active?: boolean; onClick: () => void; pill?: boolean }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left", border: pill ? `1px solid ${active ? "var(--blue-600)" : "var(--border-default)"}` : "none",
      background: active ? "var(--blue-50)" : "transparent", color: active ? "var(--blue-600)" : "var(--text-primary)",
      borderRadius: pill ? 9999 : 6, padding: pill ? "6px 12px" : "8px 10px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)",
    }}>{children}</button>
  );
}
