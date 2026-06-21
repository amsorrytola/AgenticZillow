// Deterministic tool catalog for the agents. Grounding the agents in real math over
// the synthetic catalog keeps them accurate, fast, and cheap (no LLM needed to
// compute a mortgage or a cap rate). The LLM only narrates and routes.

import type { Listing, SearchFilters } from "@/lib/domain/types";
import { repo } from "@/lib/data/repository";
import { fmtPrice, fullAddress } from "@/lib/format";

export interface ToolResult<T = unknown> {
  summary: string;
  data: T;
}

// ── search ──────────────────────────────────────────────────────
export async function toolSearch(filters: SearchFilters): Promise<ToolResult> {
  const res = await repo.search({ ...filters, limit: filters.limit ?? 24 });
  return {
    summary: `${res.total.toLocaleString()} ${filters.transaction === "rent" ? "rentals" : "homes"} match`,
    data: res,
  };
}

// ── comparables ─────────────────────────────────────────────────
export async function toolComps(listingId: string): Promise<ToolResult> {
  const target = await repo.getListing(listingId);
  if (!target) return { summary: "Listing not found", data: null };
  const comps = await repo.similar(listingId, 6);
  const ppsf = comps.map((c) => c.pricePerSqft).sort((a, b) => a - b);
  const medianPpsf = ppsf.length ? ppsf[Math.floor(ppsf.length / 2)] : target.pricePerSqft;
  return {
    summary: `${comps.length} comparable homes nearby (median $${medianPpsf}/sqft)`,
    data: {
      comps: comps.map((c) => ({ id: c.id, address: fullAddress(c), price: c.price, pricePerSqft: c.pricePerSqft, beds: c.beds, baths: c.baths, sqft: c.sqft })),
      medianPpsf,
      targetPpsf: target.pricePerSqft,
    },
  };
}

// ── valuation (Zestimate-style) ─────────────────────────────────
export async function toolValuation(listingId: string): Promise<ToolResult> {
  const l = await repo.getListing(listingId);
  if (!l) return { summary: "Listing not found", data: null };
  const delta = l.price - l.zestimate;
  const pct = (delta / l.zestimate) * 100;
  return {
    summary: `Estimated value ${fmtPrice(l.zestimate)} — listed ${pct >= 0 ? `${pct.toFixed(1)}% above` : `${Math.abs(pct).toFixed(1)}% below`} estimate`,
    data: {
      zestimate: l.zestimate,
      rentZestimate: l.rentZestimate,
      listPrice: l.price,
      deltaPct: +pct.toFixed(1),
      pricePerSqft: l.pricePerSqft,
      drivers: ["recent nearby sales", `${l.sqft.toLocaleString()} sqft`, `${l.yearBuilt} build`, `${l.neighborhood} location`],
    },
  };
}

// ── mortgage ────────────────────────────────────────────────────
export interface MortgageInput {
  price: number;
  downPct?: number;
  ratePct?: number;
  termYears?: number;
  taxRatePct?: number;
  insMonthly?: number;
  hoaMonthly?: number;
}
export function toolMortgage(input: MortgageInput): ToolResult {
  const price = input.price;
  const downPct = input.downPct ?? 20;
  const ratePct = input.ratePct ?? 6.8;
  const termYears = input.termYears ?? 30;
  const down = price * (downPct / 100);
  const loan = price - down;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  const pi = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  const tax = (price * ((input.taxRatePct ?? 1.1) / 100)) / 12;
  const ins = input.insMonthly ?? Math.round((price * 0.0035) / 12);
  const hoa = input.hoaMonthly ?? 0;
  const total = pi + tax + ins + hoa;
  return {
    summary: `~${fmtPrice(Math.round(total))}/mo (${downPct}% down, ${ratePct}% APR)`,
    data: {
      monthlyTotal: Math.round(total),
      principalInterest: Math.round(pi),
      tax: Math.round(tax),
      insurance: Math.round(ins),
      hoa: Math.round(hoa),
      downPayment: Math.round(down),
      loanAmount: Math.round(loan),
      ratePct,
      termYears,
    },
  };
}

// ── affordability ───────────────────────────────────────────────
export function toolAffordability(input: {
  annualIncome: number;
  monthlyDebts?: number;
  downPayment?: number;
  ratePct?: number;
}): ToolResult {
  const monthlyIncome = input.annualIncome / 12;
  const maxPiti = monthlyIncome * 0.36 - (input.monthlyDebts ?? 0); // 36% DTI
  const r = (input.ratePct ?? 6.8) / 100 / 12;
  const n = 360;
  // assume taxes+ins ≈ 25% of payment; solve loan from P&I portion
  const piBudget = maxPiti * 0.8;
  const loan = r === 0 ? piBudget * n : (piBudget * (1 - Math.pow(1 + r, -n))) / r;
  const maxPrice = Math.round((loan + (input.downPayment ?? 0)) / 1000) * 1000;
  return {
    summary: `You could afford up to ~${fmtPrice(maxPrice)}`,
    data: { maxPrice, maxMonthlyPayment: Math.round(maxPiti), assumptions: { dti: 0.36, ratePct: input.ratePct ?? 6.8 } },
  };
}

// ── deal analysis (investment) ──────────────────────────────────
export async function toolAnalyzeDeal(listingId: string): Promise<ToolResult> {
  const l = await repo.getListing(listingId);
  if (!l) return { summary: "Listing not found", data: null };
  const valuation = (await toolValuation(listingId)).data as any;
  const mortgage = toolMortgage({ price: l.price, hoaMonthly: l.hoa ?? 0 }).data as any;
  const grossYield = (l.estMonthlyRent * 12) / l.price;
  const cashFlow = l.estMonthlyRent - mortgage.monthlyTotal;
  const verdict =
    valuation.deltaPct <= -3
      ? "Strong deal — priced below estimate"
      : valuation.deltaPct <= 1
        ? "Fairly priced"
        : "Priced above estimate — negotiate";
  return {
    summary: `${verdict}. Cap rate ${l.capRate}%, ${cashFlow >= 0 ? "+" : ""}${fmtPrice(Math.round(cashFlow))}/mo cash flow`,
    data: {
      verdict,
      capRate: l.capRate,
      grossYieldPct: +(grossYield * 100).toFixed(1),
      estMonthlyRent: l.estMonthlyRent,
      monthlyCost: mortgage.monthlyTotal,
      monthlyCashFlow: Math.round(cashFlow),
      priceVsEstimatePct: valuation.deltaPct,
    },
  };
}

// ── neighborhood ────────────────────────────────────────────────
export async function toolNeighborhood(listingId: string): Promise<ToolResult> {
  const l = await repo.getListing(listingId);
  if (!l) return { summary: "Listing not found", data: null };
  const commute = 12 + Math.round((100 - l.walkScore) / 5);
  return {
    summary: `${l.neighborhood}: walk score ${l.walkScore}, schools ${l.schoolRating}/10, ~${commute}-min downtown commute`,
    data: {
      neighborhood: l.neighborhood,
      walkScore: l.walkScore,
      schoolRating: l.schoolRating,
      commuteMin: commute,
      transit: l.walkScore > 70 ? "Excellent" : l.walkScore > 50 ? "Good" : "Car-dependent",
    },
  };
}

// ── simulated real-world actions (demo) ─────────────────────────
export async function toolScheduleTour(listingId: string, when: string): Promise<ToolResult> {
  const l = await repo.getListing(listingId);
  return {
    summary: `Tour ${l ? `for ${fullAddress(l)} ` : ""}requested for ${when} — Simulated for demo.`,
    data: { status: "simulated", listingId, when },
  };
}

export async function toolDraftOffer(listingId: string, amount?: number): Promise<ToolResult> {
  const l = await repo.getListing(listingId);
  if (!l) return { summary: "Listing not found", data: null };
  const offer = amount ?? Math.round(l.price * 0.97);
  return {
    summary: `Drafted an offer of ${fmtPrice(offer)} on ${fullAddress(l)} — Simulated for demo.`,
    data: {
      status: "simulated",
      offer,
      listPrice: l.price,
      letter: `Dear Seller,\n\nWe are pleased to submit an offer of ${fmtPrice(offer)} for ${fullAddress(l)}. ` +
        `This offer reflects recent comparable sales in ${l.neighborhood}. We are pre-qualified and flexible on closing.\n\nWarm regards,\nAn AgenticZillow buyer`,
    },
  };
}
