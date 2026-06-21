/**
 * Seed generator. Writes the synthetic catalog to src/data/generated/*.json for
 * inspection and as the source for a later Supabase/pgvector import. The running
 * app does NOT need this — it generates the same catalog in-memory at runtime.
 *
 *   npm run seed
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateListings, generateAgents } from "../src/lib/data/generate";
import { METROS } from "../src/lib/data/metros";

const outDir = join(process.cwd(), "src/data/generated");
mkdirSync(outDir, { recursive: true });

const listings = generateListings();
const agents = generateAgents();

writeFileSync(join(outDir, "listings.json"), JSON.stringify(listings));
writeFileSync(join(outDir, "agents.json"), JSON.stringify(agents));

const rentals = listings.filter((l) => l.transaction === "rent").length;
console.log(
  `✓ Seeded ${listings.length} listings (${rentals} rentals) across ${METROS.length} metros + ${agents.length} agents/lenders\n` +
    `  → ${outDir}/listings.json, agents.json\n` +
    `  Embeddings: local hashed-${listings[0].embedding?.length}d (set GEMINI_API_KEY to upgrade for the Supabase path).`,
);
