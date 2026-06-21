/**
 * Seed the AgenticZillow Supabase project (listings + agents, with embeddings).
 * Uses the service-role key. Run AFTER applying supabase/migrations/0001_init.sql.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/seed-supabase.ts
 */
import { createClient } from "@supabase/supabase-js";
import { generateListings, generateAgents } from "../src/lib/data/generate";
import type { Listing, AgentProfile } from "../src/lib/domain/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const listingRow = (l: Listing) => ({
  id: l.id, slug: l.slug, status: l.status, transaction: l.transaction, price: l.price,
  beds: l.beds, baths: l.baths, sqft: l.sqft, lot_sqft: l.lotSqft, year_built: l.yearBuilt,
  home_type: l.homeType, line1: l.address.line1, city: l.address.city, state: l.address.state, zip: l.address.zip,
  lat: l.lat, lng: l.lng, neighborhood: l.neighborhood, metro_id: l.metroId, photos: l.photos,
  description: l.description, features: l.features, hoa: l.hoa, days_on_market: l.daysOnMarket,
  listed_at: l.listedAt, price_cut: l.priceCut, zestimate: l.zestimate, rent_zestimate: l.rentZestimate,
  price_per_sqft: l.pricePerSqft, attribution: l.attribution, school_rating: l.schoolRating,
  walk_score: l.walkScore, est_monthly_rent: l.estMonthlyRent, cap_rate: l.capRate,
  search_text: l.searchText, embedding: JSON.stringify(l.embedding ?? []),
});

const agentRow = (a: AgentProfile) => ({
  id: a.id, name: a.name, kind: a.kind, title: a.title, brokerage: a.brokerage, metro_id: a.metroId,
  photo: a.photo, rating: a.rating, reviews: a.reviews, sales: a.sales, price_range: a.priceRange,
  specialties: a.specialties, phone: a.phone, bio: a.bio,
});

async function main() {
  const listings = generateListings().map(listingRow);
  const agents = generateAgents().map(agentRow);

  const chunk = 50;
  for (let i = 0; i < listings.length; i += chunk) {
    const batch = listings.slice(i, i + chunk);
    const { error } = await sb.from("listings").upsert(batch);
    if (error) {
      console.error("listings batch error:", error.message);
      process.exit(1);
    }
    console.log(`  listings ${Math.min(i + chunk, listings.length)}/${listings.length}`);
  }

  const { error: aerr } = await sb.from("agents_lenders").upsert(agents);
  if (aerr) {
    console.error("agents error:", aerr.message);
    process.exit(1);
  }
  console.log(`✓ Seeded ${listings.length} listings + ${agents.length} agents/lenders to Supabase.`);
}

main();
