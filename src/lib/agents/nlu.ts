// Deterministic natural-language understanding: parses a user query into structured
// filters + an intent. Used as the always-on fallback when no LLM key is configured,
// and as a fast pre-pass even when one is. The LLM (when present) refines this.

import type { HomeType, SearchFilters, TransactionType } from "@/lib/domain/types";
import { METROS } from "@/lib/data/metros";

export type Intent =
  | "search"
  | "afford"
  | "mortgage"
  | "value"
  | "analyze"
  | "tour"
  | "offer"
  | "neighborhood"
  | "chat";

const HOME_TYPE_WORDS: [RegExp, HomeType][] = [
  [/\bcondos?\b/i, "Condo"],
  [/\btownhouses?|townhomes?\b/i, "Townhouse"],
  [/\bapartments?\b/i, "Apartment"],
  [/\bmulti-?family|duplex|triplex\b/i, "Multi-family"],
  [/\bhouses?|homes?|single-?family\b/i, "House"],
];

const FEATURE_WORDS = [
  "pool", "garage", "yard", "office", "basement", "patio", "deck", "view",
  "renovated", "updated", "solar", "ev charger", "fireplace", "hardwood",
];

function parseMoney(raw: string): number | null {
  const m = raw.replace(/[, $]/g, "").match(/^(\d+(?:\.\d+)?)([km])?$/i);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const suf = (m[2] || "").toLowerCase();
  if (suf === "k") n *= 1000;
  else if (suf === "m") n *= 1_000_000;
  else if (n < 100) n *= 1000; // bare "700" → 700k for housing context
  return Math.round(n);
}

export function parseQuery(text: string): { filters: SearchFilters; intent: Intent; location?: string } {
  const t = text.toLowerCase();
  const filters: SearchFilters = {};

  // transaction
  let transaction: TransactionType = "buy";
  if (/\b(rent|lease|rental)\b/.test(t)) transaction = "rent";
  else if (/\bsold\b/.test(t)) transaction = "sold";
  filters.transaction = transaction;

  // metro / location
  let location: string | undefined;
  for (const m of METROS) {
    if (t.includes(m.city.toLowerCase())) {
      filters.metroId = m.id;
      location = `${m.city}, ${m.state}`;
      break;
    }
  }

  // price
  const between = t.match(/(?:between\s+)?\$?\s*([\d.,]+\s*[km]?)\s*(?:-|to|and)\s*\$?\s*([\d.,]+\s*[km]?)/i);
  if (between) {
    const lo = parseMoney(between[1]);
    const hi = parseMoney(between[2]);
    if (lo) filters.minPrice = lo;
    if (hi) filters.maxPrice = hi;
  } else {
    const under = t.match(/(?:under|below|less than|up to|max)\s+\$?\s*([\d.,]+\s*[km]?)/i);
    if (under) {
      const v = parseMoney(under[1]);
      if (v) filters.maxPrice = v;
    }
    const over = t.match(/(?:over|above|more than|min|starting at)\s+\$?\s*([\d.,]+\s*[km]?)/i);
    if (over) {
      const v = parseMoney(over[1]);
      if (v) filters.minPrice = v;
    }
  }

  // beds / baths
  const beds = t.match(/(\d+)\s*\+?\s*(?:bed|bd|br|bedroom)/i);
  if (beds) filters.beds = parseInt(beds[1], 10);
  const baths = t.match(/(\d+)\s*\+?\s*(?:bath|ba)/i);
  if (baths) filters.baths = parseInt(baths[1], 10);

  // home type
  for (const [re, type] of HOME_TYPE_WORDS) {
    if (re.test(t)) {
      filters.homeTypes = [type];
      break;
    }
  }

  // features
  const features = FEATURE_WORDS.filter((f) => t.includes(f));
  if (features.length) filters.features = features.map((f) => f.replace(/\b\w/, (c) => c.toUpperCase()));

  // semantic: keep descriptive remainder if the query reads qualitatively
  if (/\b(cozy|charming|craftsman|modern|character|quiet|bright|luxury|near|walk|coffee|vibe|feel)\b/.test(t)) {
    filters.semantic = text.trim();
  }

  // intent
  let intent: Intent = "search";
  if (/\bafford|budget|qualify|how much.*make|income\b/.test(t)) intent = "afford";
  else if (/\bmortgage|monthly payment|down payment|interest rate\b/.test(t)) intent = "mortgage";
  else if (/\bworth|value|zestimate|estimate my\b/.test(t)) intent = "value";
  else if (/\bgood deal|analy[sz]e|roi|cap rate|investment|cash flow\b/.test(t)) intent = "analyze";
  else if (/\btour|visit|showing|see it|walk through\b/.test(t)) intent = "tour";
  else if (/\boffer|bid|make an offer\b/.test(t)) intent = "offer";
  else if (/\bneighborhood|schools?|commute|walk score|area\b/.test(t)) intent = "neighborhood";
  else if (
    filters.metroId || filters.beds || filters.maxPrice || filters.minPrice ||
    filters.homeTypes || filters.semantic || /\b(find|show|search|looking|homes?|houses?|condo)\b/.test(t)
  ) intent = "search";
  else intent = "chat";

  return { filters, intent, location };
}
