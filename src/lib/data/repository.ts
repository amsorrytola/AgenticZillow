import type {
  AgentProfile,
  Listing,
  Metro,
  SearchFilters,
  SearchResult,
} from "@/lib/domain/types";
import { METROS } from "./metros";
import { generateAgents, generateListings } from "./generate";
import { searchListings, similarListings } from "./search";

/**
 * Storage-agnostic repository. The app talks to this interface only; today it is
 * backed by the in-memory synthetic catalog, later by Supabase + pgvector behind
 * the same surface (see CLAUDE.md). No other Supabase project is ever touched.
 */
export interface Repository {
  metros(): Metro[];
  allListings(): Promise<Listing[]>;
  getListing(idOrSlug: string): Promise<Listing | null>;
  search(filters: SearchFilters): Promise<SearchResult>;
  similar(id: string, n?: number): Promise<Listing[]>;
  byIds(ids: string[]): Promise<Listing[]>;
  agents(opts?: { metroId?: string; kind?: "agent" | "lender" }): Promise<AgentProfile[]>;
  getAgent(id: string): Promise<AgentProfile | null>;
}

class InMemoryRepository implements Repository {
  private listings = generateListings();
  private agentList = generateAgents();
  private byId = new Map(this.listings.map((l) => [l.id, l]));
  private bySlug = new Map(this.listings.map((l) => [l.slug, l]));

  metros(): Metro[] {
    return METROS.map(({ priceBase, priceVar, rentBase, streets, zips, spread, ...m }) => m);
  }

  async allListings(): Promise<Listing[]> {
    return this.listings;
  }

  async getListing(idOrSlug: string): Promise<Listing | null> {
    return this.byId.get(idOrSlug) ?? this.bySlug.get(idOrSlug) ?? null;
  }

  async search(filters: SearchFilters): Promise<SearchResult> {
    return searchListings(this.listings, filters);
  }

  async similar(id: string, n = 6): Promise<Listing[]> {
    const target = this.byId.get(id);
    return target ? similarListings(this.listings, target, n) : [];
  }

  async byIds(ids: string[]): Promise<Listing[]> {
    return ids.map((id) => this.byId.get(id)).filter((l): l is Listing => Boolean(l));
  }

  async agents(opts?: { metroId?: string; kind?: "agent" | "lender" }): Promise<AgentProfile[]> {
    return this.agentList.filter(
      (a) =>
        (!opts?.metroId || a.metroId === opts.metroId) &&
        (!opts?.kind || a.kind === opts.kind),
    );
  }

  async getAgent(id: string): Promise<AgentProfile | null> {
    return this.agentList.find((a) => a.id === id) ?? null;
  }
}

// Singleton (module-cached). Uses Supabase when explicitly enabled AND configured;
// otherwise the in-memory synthetic catalog (so the app always runs). Repository is
// server-only — never imported by client components.
function createRepository(): Repository {
  const useSupabase =
    process.env.USE_SUPABASE === "true" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (useSupabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { SupabaseRepository } = require("./supabase-repository");
      return new SupabaseRepository();
    } catch (e) {
      console.warn("[repository] Supabase init failed, falling back to in-memory:", e);
    }
  }
  return new InMemoryRepository();
}

export const repo: Repository = createRepository();
