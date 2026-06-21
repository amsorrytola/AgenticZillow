import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AgentProfile,
  Listing,
  Metro,
  SearchFilters,
  SearchResult,
} from "@/lib/domain/types";
import { METROS } from "./metros";
import { searchListings, similarListings } from "./search";
import type { Repository } from "./repository";

// Server-only Supabase adapter behind the same Repository interface as the
// in-memory store. Uses the service-role key (never shipped to the client). The
// 150-row catalog is small, so we load it once and reuse the shared search.ts
// ranking for exact parity with the in-memory path; pgvector's match_listings()
// is available in the DB for the scale-up path.

function num(v: unknown, d = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : d;
}

function parseEmbedding(v: unknown): number[] | undefined {
  if (Array.isArray(v)) return v as number[];
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToListing(r: any): Listing {
  return {
    id: r.id,
    slug: r.slug,
    status: r.status,
    transaction: r.transaction,
    price: num(r.price),
    beds: num(r.beds),
    baths: num(r.baths),
    sqft: num(r.sqft),
    lotSqft: r.lot_sqft == null ? null : num(r.lot_sqft),
    yearBuilt: num(r.year_built),
    homeType: r.home_type,
    address: { line1: r.line1, city: r.city, state: r.state, zip: r.zip },
    lat: num(r.lat),
    lng: num(r.lng),
    neighborhood: r.neighborhood,
    metroId: r.metro_id,
    photos: r.photos ?? [],
    description: r.description ?? "",
    features: r.features ?? [],
    hoa: r.hoa == null ? null : num(r.hoa),
    daysOnMarket: num(r.days_on_market),
    listedAt: r.listed_at,
    priceCut: r.price_cut ?? null,
    zestimate: num(r.zestimate),
    rentZestimate: num(r.rent_zestimate),
    pricePerSqft: num(r.price_per_sqft),
    attribution: r.attribution ?? "",
    schoolRating: num(r.school_rating),
    walkScore: num(r.walk_score),
    estMonthlyRent: num(r.est_monthly_rent),
    capRate: num(r.cap_rate),
    searchText: r.search_text ?? "",
    embedding: parseEmbedding(r.embedding),
  };
}

function rowToAgent(r: any): AgentProfile {
  return {
    id: r.id,
    name: r.name,
    kind: r.kind,
    title: r.title,
    brokerage: r.brokerage,
    metroId: r.metro_id,
    photo: r.photo,
    rating: num(r.rating),
    reviews: num(r.reviews),
    sales: num(r.sales),
    priceRange: r.price_range,
    specialties: r.specialties ?? [],
    phone: r.phone,
    bio: r.bio,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class SupabaseRepository implements Repository {
  private sb: SupabaseClient;
  private cache: Promise<Listing[]> | null = null;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    this.sb = createClient(url, key, { auth: { persistSession: false } });
  }

  metros(): Metro[] {
    return METROS.map(({ priceBase, priceVar, rentBase, streets, zips, spread, ...m }) => m);
  }

  async allListings(): Promise<Listing[]> {
    if (!this.cache) {
      this.cache = (async () => {
        const { data, error } = await this.sb.from("listings").select("*").limit(1000);
        if (error) throw error;
        return (data ?? []).map(rowToListing);
      })();
    }
    return this.cache;
  }

  async getListing(idOrSlug: string): Promise<Listing | null> {
    const all = await this.allListings();
    return all.find((l) => l.id === idOrSlug || l.slug === idOrSlug) ?? null;
  }

  async search(filters: SearchFilters): Promise<SearchResult> {
    return searchListings(await this.allListings(), filters);
  }

  async similar(id: string, n = 6): Promise<Listing[]> {
    const all = await this.allListings();
    const target = all.find((l) => l.id === id);
    return target ? similarListings(all, target, n) : [];
  }

  async byIds(ids: string[]): Promise<Listing[]> {
    const all = await this.allListings();
    const set = new Set(ids);
    return all.filter((l) => set.has(l.id));
  }

  async agents(opts?: { metroId?: string; kind?: "agent" | "lender" }): Promise<AgentProfile[]> {
    let q = this.sb.from("agents_lenders").select("*");
    if (opts?.metroId) q = q.eq("metro_id", opts.metroId);
    if (opts?.kind) q = q.eq("kind", opts.kind);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(rowToAgent);
  }

  async getAgent(id: string): Promise<AgentProfile | null> {
    const { data } = await this.sb.from("agents_lenders").select("*").eq("id", id).limit(1);
    return data && data[0] ? rowToAgent(data[0]) : null;
  }
}
