import type { Listing, SearchFilters, SearchResult, SortKey } from "@/lib/domain/types";
import { localEmbed, cosine } from "./embed";

function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function matchesFilters(l: Listing, f: SearchFilters): boolean {
  const tx = f.transaction ?? "buy";
  if (l.transaction !== tx) return false;
  if (f.metroId && l.metroId !== f.metroId) return false;
  if (f.minPrice != null && l.price < f.minPrice) return false;
  if (f.maxPrice != null && l.price > f.maxPrice) return false;
  if (f.beds != null && l.beds < f.beds) return false;
  if (f.baths != null && l.baths < f.baths) return false;
  if (f.minSqft != null && l.sqft < f.minSqft) return false;
  if (f.maxSqft != null && l.sqft > f.maxSqft) return false;
  if (f.minYear != null && l.yearBuilt < f.minYear) return false;
  if (f.maxHoa != null && (l.hoa ?? 0) > f.maxHoa) return false;
  if (f.homeTypes && f.homeTypes.length && !f.homeTypes.includes(l.homeType)) return false;
  if (f.features && f.features.length) {
    const hay = l.searchText.toLowerCase();
    if (!f.features.every((feat) => hay.includes(feat.toLowerCase()))) return false;
  }
  if (f.bbox) {
    const [w, s, e, n] = f.bbox;
    if (l.lng < w || l.lng > e || l.lat < s || l.lat > n) return false;
  }
  return true;
}

function dealScore(l: Listing): number {
  // higher = better deal (priced below AI estimate)
  return (l.zestimate - l.price) / Math.max(l.zestimate, 1);
}

function sortListings(
  arr: { l: Listing; score: number }[],
  sort: SortKey,
): Listing[] {
  const by = [...arr];
  switch (sort) {
    case "price-desc":
      by.sort((a, b) => b.l.price - a.l.price);
      break;
    case "price-asc":
      by.sort((a, b) => a.l.price - b.l.price);
      break;
    case "newest":
      by.sort((a, b) => b.l.listedAt.localeCompare(a.l.listedAt));
      break;
    case "ai-deal":
      by.sort((a, b) => dealScore(b.l) - dealScore(a.l));
      break;
    case "ai-match":
      by.sort(
        (a, b) =>
          b.score * 2 + b.l.schoolRating / 10 + b.l.walkScore / 100 -
          (a.score * 2 + a.l.schoolRating / 10 + a.l.walkScore / 100),
      );
      break;
    case "relevance":
    default:
      by.sort((a, b) => b.score - a.score || a.l.daysOnMarket - b.l.daysOnMarket);
  }
  return by.map((x) => x.l);
}

export function buildChips(f: SearchFilters): { label: string; byAI?: boolean }[] {
  const chips: { label: string; byAI?: boolean }[] = [];
  if (f.homeTypes) for (const t of f.homeTypes) chips.push({ label: `${t}s` });
  if (f.beds) chips.push({ label: `${f.beds}+ beds` });
  if (f.baths) chips.push({ label: `${f.baths}+ baths` });
  if (f.maxPrice && f.minPrice) chips.push({ label: `${money(f.minPrice)}–${money(f.maxPrice)}` });
  else if (f.maxPrice) chips.push({ label: `≤ ${money(f.maxPrice)}` });
  else if (f.minPrice) chips.push({ label: `≥ ${money(f.minPrice)}` });
  if (f.minSqft) chips.push({ label: `${f.minSqft.toLocaleString()}+ sqft` });
  if (f.features) for (const ft of f.features) chips.push({ label: ft, byAI: true });
  if (f.semantic) chips.push({ label: `“${f.semantic}”`, byAI: true });
  return chips;
}

export function searchListings(all: Listing[], filters: SearchFilters): SearchResult {
  const sort: SortKey = filters.sort ?? (filters.semantic ? "ai-match" : "relevance");
  const qVec = filters.semantic ? localEmbed(filters.semantic) : null;

  const scored = all
    .filter((l) => matchesFilters(l, filters))
    .map((l) => {
      let score = 0;
      if (qVec && l.embedding) score = cosine(qVec, l.embedding);
      else score = 0.5 + (10 - l.daysOnMarket / 9) / 100; // mild recency prior
      return { l, score };
    });

  // If a semantic query is present, drop very weak matches so results feel intentional.
  const filtered = qVec ? scored.filter((s) => s.score > 0.02) : scored;
  const ranked = sortListings(filtered, sort);

  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 60;
  return {
    listings: ranked.slice(offset, offset + limit),
    total: ranked.length,
    appliedFilters: { ...filters, sort },
    appliedChips: buildChips(filters),
  };
}

export function similarListings(all: Listing[], target: Listing, n = 6): Listing[] {
  if (!target.embedding) return [];
  return all
    .filter((l) => l.id !== target.id && l.transaction === target.transaction)
    .map((l) => ({ l, s: l.embedding ? cosine(target.embedding!, l.embedding) : 0 }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.l);
}
