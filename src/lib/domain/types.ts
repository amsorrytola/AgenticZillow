// AgenticZillow — core domain types. Single source of truth for data shapes.

export type ListingStatus =
  | "for-sale"
  | "new"
  | "pending"
  | "coming-soon"
  | "sold"
  | "tour";

export type HomeType =
  | "House"
  | "Condo"
  | "Townhouse"
  | "Apartment"
  | "Multi-family"
  | "Land";

export type TransactionType = "buy" | "rent" | "sold" | "off-market";

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
}

export interface Listing {
  id: string;
  slug: string;
  status: ListingStatus;
  transaction: TransactionType;
  /** Sale price, or monthly rent when transaction === "rent". */
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft: number | null;
  yearBuilt: number;
  homeType: HomeType;
  address: Address;
  lat: number;
  lng: number;
  neighborhood: string;
  metroId: string;
  photos: string[];
  description: string;
  features: string[];
  hoa: number | null;
  daysOnMarket: number;
  listedAt: string; // ISO
  priceCut: { amount: number; date: string } | null;
  /** AI home valuation. */
  zestimate: number;
  rentZestimate: number;
  pricePerSqft: number;
  attribution: string;
  schoolRating: number; // 1–10
  walkScore: number; // 0–100
  // Investment signals
  estMonthlyRent: number;
  capRate: number; // %
  // Semantic search
  searchText: string;
  embedding?: number[];
}

export type SortKey =
  | "relevance"
  | "price-desc"
  | "price-asc"
  | "newest"
  | "ai-match"
  | "ai-deal";

export interface SearchFilters {
  /** Free-text location ("Austin, TX") or natural-language remainder. */
  q?: string;
  transaction?: TransactionType;
  metroId?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number; // minimum
  baths?: number; // minimum
  homeTypes?: HomeType[];
  minSqft?: number;
  maxSqft?: number;
  minYear?: number;
  maxHoa?: number;
  features?: string[];
  /** Semantic intent for vector search ("cozy craftsman near coffee"). */
  semantic?: string;
  sort?: SortKey;
  /** Map bounds [west, south, east, north]. */
  bbox?: [number, number, number, number];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  listings: Listing[];
  total: number;
  /** Filters the system actually applied (incl. anything inferred by the agent). */
  appliedFilters: SearchFilters;
  /** Human-readable chips, incl. AI-applied ones. */
  appliedChips: { label: string; byAI?: boolean }[];
}

export interface Metro {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  /** default map zoom */
  zoom: number;
  neighborhoods: string[];
}

export interface AgentProfile {
  id: string;
  name: string;
  kind: "agent" | "lender";
  title: string;
  brokerage: string;
  metroId: string;
  photo: string;
  rating: number;
  reviews: number;
  sales: number;
  priceRange: string;
  specialties: string[];
  phone: string;
  bio: string;
}

// ── Users / auth ────────────────────────────────────────────────
export interface User {
  id: string;
  email: string | null;
  name: string;
  isGuest: boolean;
  isDemo: boolean;
  savedHomeIds: string[];
  savedSearchIds: string[];
}

// ── Agentic layer ───────────────────────────────────────────────
export type AgentName =
  | "orchestrator"
  | "search"
  | "market"
  | "finance"
  | "concierge"
  | "neighborhood";

export type StepStatus = "pending" | "running" | "ok" | "error";

export interface AgentStep {
  id: string;
  agent: AgentName;
  label: string;
  status: StepStatus;
  tool?: string;
  provider?: string;
  model?: string;
  costUsd?: number;
  durationMs?: number;
  result?: unknown;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  listings?: Listing[];
}

/** Server-sent events streamed to the Copilot (chat + Live Activity Timeline). */
export type AgentEvent =
  | { type: "run_start"; runId: string; mode: "chat" | "autonomous"; plan: string[] }
  | { type: "step"; step: AgentStep }
  | { type: "step_update"; step: AgentStep }
  | { type: "token"; text: string }
  | { type: "message"; role: "assistant"; content: string }
  | { type: "listings"; listings: Listing[] }
  | { type: "filters"; filters: SearchFilters; chips: { label: string; byAI?: boolean }[] }
  | { type: "action"; kind: string; status: "simulated"; detail: string }
  | { type: "run_end"; runId: string; costUsd: number }
  | { type: "error"; message: string };

export const AGENT_META: Record<AgentName, { glyph: string; label: string }> = {
  orchestrator: { glyph: "🧭", label: "Orchestrator" },
  search: { glyph: "🔎", label: "Search" },
  market: { glyph: "📈", label: "Market" },
  finance: { glyph: "💰", label: "Finance" },
  concierge: { glyph: "📅", label: "Concierge" },
  neighborhood: { glyph: "🏘️", label: "Neighborhood" },
};
