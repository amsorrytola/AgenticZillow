import type {
  AgentProfile,
  HomeType,
  Listing,
  ListingStatus,
  TransactionType,
} from "@/lib/domain/types";
import { METROS, type MetroSeed } from "./metros";
import { galleryFor } from "./photos";
import { localEmbed } from "./embed";

// Deterministic PRNG so the synthetic catalog is stable across runs (no DB needed).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HOME_TYPES: HomeType[] = ["House", "House", "House", "Condo", "Townhouse", "Multi-family"];
const FEATURE_POOL = [
  "Hardwood floors", "Updated kitchen", "Quartz countertops", "Stainless appliances",
  "Primary suite", "Walk-in closet", "Fenced yard", "Covered patio", "Two-car garage",
  "Open floor plan", "Vaulted ceilings", "Natural light", "Home office", "Finished basement",
  "Pool", "Rooftop deck", "EV charger", "Solar panels", "Smart home", "Mountain views",
  "Walk to coffee", "Near parks", "Quiet street", "Craftsman character", "New construction",
  "Chef's kitchen", "Soaking tub", "Mudroom", "Gas range", "Central AC",
];
const VIBES = ["craftsman", "modern", "midcentury", "cozy", "luxury", "renovated", "charming", "bright"];
const BROKERAGES = [
  "Lone Star Realty", "Hill Country Homes", "Capital Realty", "Urban Living Co.",
  "Bramlett Residential", "Moreland Properties", "Compass", "Keller Williams",
  "Coldwell Banker", "Redfin", "Better Homes", "Sotheby's Intl.",
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function pickN<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
}
function round(n: number, to: number) {
  return Math.round(n / to) * to;
}

const STATUS_WEIGHTS: [ListingStatus, number][] = [
  ["for-sale", 0.5], ["new", 0.18], ["tour", 0.12], ["pending", 0.1], ["coming-soon", 0.06], ["sold", 0.04],
];
function weightedStatus(rng: () => number): ListingStatus {
  const r = rng();
  let acc = 0;
  for (const [s, w] of STATUS_WEIGHTS) {
    acc += w;
    if (r <= acc) return s;
  }
  return "for-sale";
}

const PER_METRO = 30;
const RENT_FRACTION = 0.28; // ~28% of inventory are rentals
const OFFMARKET_FRACTION = 0.08;

function makeListing(metro: MetroSeed, i: number, globalIndex: number): Listing {
  const rng = mulberry32(globalIndex * 7919 + 17);
  const homeType = pick(rng, HOME_TYPES);
  const beds = homeType === "Condo" ? 1 + Math.floor(rng() * 3) : 2 + Math.floor(rng() * 4);
  const baths = Math.max(1, Math.min(beds, 1 + Math.floor(rng() * 3))) + (rng() > 0.6 ? 0.5 : 0);
  const sqft = round(
    (homeType === "Condo" ? 700 : 1100) + rng() * (homeType === "Condo" ? 1100 : 2400),
    10,
  );
  const yearBuilt = 1920 + Math.floor(rng() * 104);
  const neighborhood = pick(rng, metro.neighborhoods);
  const street = pick(rng, metro.streets);
  const num = 100 + Math.floor(rng() * 8900);
  const zip = pick(rng, metro.zips);

  // pricing scaled by metro + size + a noise factor
  const sizeFactor = sqft / 1800;
  const noise = 1 + (rng() - 0.5) * metro.priceVar;
  let salePrice = round(metro.priceBase * sizeFactor * noise, 1000);
  salePrice = Math.max(180000, salePrice);

  const roll = rng();
  let transaction: TransactionType = "buy";
  let status = weightedStatus(rng);
  if (roll < RENT_FRACTION) {
    transaction = "rent";
    status = "for-sale"; // rentals shown as available
  } else if (roll < RENT_FRACTION + OFFMARKET_FRACTION) {
    transaction = "off-market";
  } else if (status === "sold") {
    transaction = "sold";
  }

  const estMonthlyRent = round(metro.rentBase * sizeFactor * (0.9 + rng() * 0.5), 25);
  const price = transaction === "rent" ? estMonthlyRent : salePrice;

  const daysOnMarket = 1 + Math.floor(rng() * 80);
  const listedAt = new Date(2026, 4, 1 - daysOnMarket).toISOString();
  const hasCut = transaction !== "rent" && rng() > 0.7;
  const priceCut = hasCut
    ? { amount: round(salePrice * (0.01 + rng() * 0.04), 500), date: "May 2" }
    : null;

  const zestimate = round(salePrice * (0.94 + rng() * 0.12), 1000);
  const pricePerSqft = Math.round(salePrice / sqft);
  const vibes = pickN(rng, VIBES, 2);
  const features = pickN(rng, FEATURE_POOL, 4 + Math.floor(rng() * 4));
  const schoolRating = 4 + Math.floor(rng() * 7);
  const walkScore = 35 + Math.floor(rng() * 64);
  const capRate = +(3 + rng() * 5).toFixed(1);

  const lat = metro.lat + (rng() - 0.5) * 2 * metro.spread;
  const lng = metro.lng + (rng() - 0.5) * 2 * metro.spread;

  const description =
    `${vibes[0][0].toUpperCase() + vibes[0].slice(1)} ${homeType.toLowerCase()} in ${neighborhood}. ` +
    `${beds} bed, ${baths} bath with ${features.slice(0, 3).join(", ").toLowerCase()}. ` +
    `${vibes[1]} finishes throughout and a ${rng() > 0.5 ? "sunny" : "private"} setting — ` +
    `${transaction === "rent" ? "available now for lease" : "move-in ready"}.`;

  const searchText = [
    vibes.join(" "), homeType, neighborhood, metro.city, metro.state,
    features.join(" "), description,
  ].join(" ");

  const id = `${metro.id}-${String(i + 1).padStart(3, "0")}`;
  const slug = `${num}-${street.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${metro.city.toLowerCase()}-${zip}`;

  return {
    id,
    slug,
    status,
    transaction,
    price,
    beds,
    baths,
    sqft,
    lotSqft: homeType === "Condo" ? null : round(sqft * (1.5 + rng() * 4), 100),
    yearBuilt,
    homeType,
    address: { line1: `${num} ${street}${homeType === "Condo" ? ` #${100 + Math.floor(rng() * 1500)}` : ""}`, city: metro.city, state: metro.state, zip },
    lat,
    lng,
    neighborhood,
    metroId: metro.id,
    photos: galleryFor(globalIndex, 6),
    description,
    features,
    hoa: homeType === "Condo" || homeType === "Townhouse" ? round(150 + rng() * 600, 5) : null,
    daysOnMarket,
    listedAt,
    priceCut,
    zestimate,
    rentZestimate: estMonthlyRent,
    pricePerSqft,
    attribution: `Listing by ${pick(rng, BROKERAGES)}`,
    schoolRating,
    walkScore,
    estMonthlyRent,
    capRate,
    searchText,
    embedding: localEmbed(searchText),
  };
}

let _cache: Listing[] | null = null;

export function generateListings(): Listing[] {
  if (_cache) return _cache;
  const out: Listing[] = [];
  let g = 0;
  for (const metro of METROS) {
    for (let i = 0; i < PER_METRO; i++) {
      out.push(makeListing(metro, i, g++));
    }
  }
  _cache = out;
  return out;
}

// ── Agents & lenders ────────────────────────────────────────────
const AGENT_NAMES = [
  "Maria Gonzalez", "James Chen", "Aisha Patel", "Robert Kim", "Sofia Rossi",
  "David Nguyen", "Emily Carter", "Marcus Johnson", "Olivia Martinez", "Daniel Lee",
  "Grace Williams", "Andre Dubois", "Priya Shah", "Tom Bradley", "Nina Alvarez",
];
const SPECIALTIES = [
  "First-time buyers", "Luxury homes", "Investment", "New construction",
  "Relocation", "Condos & lofts", "Historic homes", "Sellers' agent",
];

export function generateAgents(): AgentProfile[] {
  const out: AgentProfile[] = [];
  let g = 0;
  for (const metro of METROS) {
    for (let i = 0; i < 3; i++) {
      const rng = mulberry32(g * 104729 + 3);
      const name = AGENT_NAMES[(g) % AGENT_NAMES.length];
      const kind: "agent" | "lender" = i === 2 ? "lender" : "agent";
      out.push({
        id: `${metro.id}-pro-${i + 1}`,
        name,
        kind,
        title: kind === "lender" ? "Senior Loan Officer" : "Real Estate Agent",
        brokerage: kind === "lender" ? pick(rng, ["Summit Lending", "BlueKey Mortgage", "Cardinal Home Loans"]) : pick(rng, BROKERAGES),
        metroId: metro.id,
        photo: `https://i.pravatar.cc/160?img=${(g % 70) + 1}`,
        rating: +(4.5 + rng() * 0.5).toFixed(1),
        reviews: 20 + Math.floor(rng() * 240),
        sales: 15 + Math.floor(rng() * 180),
        priceRange: "$300K–$2.5M",
        specialties: pickN(rng, SPECIALTIES, 3),
        phone: `(${200 + Math.floor(rng() * 700)}) 555-${String(1000 + Math.floor(rng() * 8999)).slice(0, 4)}`,
        bio: `${name} has helped ${20 + Math.floor(rng() * 200)} families ${kind === "lender" ? "finance" : "buy and sell"} homes across ${metro.city}. Known for clear communication and local expertise.`,
      });
      g++;
    }
  }
  return out;
}
