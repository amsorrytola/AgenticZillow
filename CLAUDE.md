# AgenticZillow — Project Guide & Build Tracker

> A near-exact visual clone of **Zillow.com** ("AgenticZillow") with a multi-agent AI layer on top.
> Portfolio/demo showcase. Principle: **"Zillow at rest, AgenticZillow in motion."**
> Full product/engineering spec: [docs/agenticzillow-design-prompt.md](docs/agenticzillow-design-prompt.md).
> Design system (tokens + components, from Claude's design tool): [design-system/](design-system/).

This file is the source of truth for **how the project is built and where it stands**. Keep it updated as work progresses.

---

## Hard constraints (read before any infra action)

- **Vercel:** deploy ONLY to the `talhaasnariit@gmail.com` account, into a project dedicated to AgenticZillow. **Never** modify, redeploy, or delete any other Vercel project on that account.
- **Supabase:** use ONLY a project dedicated to AgenticZillow. **Never** touch any other Supabase project. The app is built **DB-agnostic** so it runs without Supabase; the hosted DB is wired only after the user confirms which project to use.
- **Secrets:** real keys live in `.env` (git-ignored). Never commit secrets, never print secret values.

---

## Stack & key decisions

| Area | Choice |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript + React |
| Styling | Design tokens (CSS variables) from `design-system/` + inline styles (matches the generated components) + Tailwind for layout utilities |
| Maps | **MapLibre GL** + keyless **OpenFreeMap "positron"** style (Zillow-like, low-saturation). Swappable to Mapbox by setting `NEXT_PUBLIC_MAPBOX_TOKEN`. |
| Photos | Direct **Unsplash CDN** URLs (keyless hotlinking) assigned to synthetic listings |
| Data (now) | **Local JSON seed** of synthetic listings (5 metros) + in-memory cosine vector search — app runs with no external DB |
| Data (later) | **Supabase Postgres + pgvector** adapter behind the same repository interface (migration in `supabase/`) |
| LLM | **Cost-aware multi-provider router** via direct HTTP (no heavy SDKs): Groq → DeepSeek/Gemini → OpenAI → **Anthropic last**. Gemini for vision + embeddings. |
| Search | Hybrid: structured filters + vector (cosine) semantic search |
| Agents | Orchestrator routing to specialists (Search, Market/Investment, Finance/Mortgage, Tour/Concierge, Neighborhood) + autonomous loop, streamed to a Live Activity Timeline via SSE |
| Auth | Guest-first + a seeded all-access demo super-user |

### LLM provider routing (cost order — Anthropic is last-resort)
`tier 0` Groq (fast routing/extraction) → `tier 1` DeepSeek (cheap reasoning) / Gemini (vision + embeddings) → `tier 2` OpenAI → `tier 3` Anthropic (premium fallback only). See `src/lib/llm/`.

---

## Environment variables

In `.env` (git-ignored). `.env.example` documents the full set.

Currently present: `GROQ_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK` (note: not `_API_KEY`), `SUPABASE_ACCESS_TOKEN`.

Not yet provided (have keyless fallbacks): Mapbox token (→ MapLibre/OpenFreeMap), Unsplash/Pexels API key (→ direct CDN URLs), `DATABASE_URL`/Supabase project URL+anon key (→ JSON data layer), Vercel token (→ CLI login).

---

## Run locally

```bash
npm install
npm run seed     # generate synthetic listings JSON (+ embeddings if GEMINI_API_KEY set)
npm run dev      # http://localhost:3000
```

---

## Build status

Legend: ✅ done · 🚧 in progress · ⬜ not started

- ✅ Foundation: tracking, gitignore, Next.js 15 + TS + Tailwind scaffold, configs
- ✅ Design tokens global CSS (`src/app/globals.css`) + ported DS components (`src/components/ds/`, with `.d.ts` types)
- ✅ Domain model (`src/lib/domain/types.ts`) + synthetic generator (`src/lib/data/generate.ts`, 150 listings/5 metros/15 pros) + `npm run seed`
- ✅ Repository (`src/lib/data/repository.ts`) + hybrid filter + local-vector search (`search.ts`, `embed.ts`)
- ✅ LLM multi-provider router (`src/lib/llm/`) — Groq→DeepSeek/Gemini→OpenAI→Anthropic, graceful fallback, cost meter, Gemini embeddings
- ✅ Agent orchestrator (`src/lib/agents/orchestrator.ts`) + tool catalog (`tools.ts`) + NL parser (`nlu.ts`) + autonomous loop + SSE (`/api/agent`)
- ✅ App shell (layout, Header, Footer, live Copilot dock + FAB, page-aware context) + Home page
- ✅ Search results: MapLibre + OpenFreeMap map, filter bar w/ popovers, list/map hover sync, AI chips
- ✅ Listing detail: gallery, AI estimate, facts, price/tax history, schools, map, mortgage widget, inline AI, similar homes
- ✅ Copilot: streaming chat + Live Activity Timeline (steps/provider/model/cost) + Autopilot (autonomous) + simulated actions
- ✅ Remaining screens: saved, agents/lenders, home-loans (affordability + mortgage), sell, compare, account (personas), 404
- ✅ Local build verified: `npm run build` clean; smoke-tested home, search API, listing, and live agent stream (run cost ~$0.0001 → Anthropic never hit ✓)
- ✅ Supabase wired: dedicated project `agenticzillow` (ref `oouccbxgpzukggnatiyn`, ap-south-1), migration applied, 150 listings + 15 pros seeded with embeddings; `USE_SUPABASE=true` → app serves from Postgres/pgvector
- ✅ Vercel deployed: project `talhas-projects-b7c7fb9f/agenticzillow` → **https://agenticzillow.vercel.app** (verified live: home, Supabase search, agent stream)
- ✅ Mobile responsive: responsive CSS utility system in `globals.css` (breakpoints 1024/860/760/460px), header hamburger, search map/list toggle, full-width copilot, restacking grids — works phone → laptop. Verified in compiled + deployed CSS.

## Live deployment

- **App:** https://agenticzillow.vercel.app (production)
- **Vercel project:** `agenticzillow` under scope `talhas-projects-b7c7fb9f` ("Talha's projects" / talhaasnariit@gmail.com). GitHub repo auto-connected (`amsorrytola/AgenticZillow`) → pushes to `main` will trigger redeploys.
- **Supabase project:** `agenticzillow` (ref `oouccbxgpzukggnatiyn`). Schema in `supabase/migrations/0001_init.sql`. Re-seed with `set -a; . ./.env; set +a; npx tsx scripts/seed-supabase.ts`.
- **Env on Vercel (production+preview):** all LLM keys + `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `USE_SUPABASE=true`. (Management `SUPABASE_ACCESS_TOKEN` intentionally NOT deployed.)
- To redeploy: `vercel deploy --prod --yes --scope talhas-projects-b7c7fb9f`.
- **Untouched (per constraints):** Supabase project `OURMINAR`; Vercel "Digidzign's projects" scope.

### What's real vs simulated
- **Real:** synthetic catalog + hybrid search, the multi-provider LLM router (live calls, cost-ordered), streaming orchestrator + timeline, all screens, MapLibre maps, saved homes (localStorage).
- **Simulated (by design, demo):** tour booking, offer drafting/submission — returned with a "Simulated for demo" badge.
- **Keyless fallbacks in use:** MapLibre+OpenFreeMap (no Mapbox token), Unsplash CDN hotlinks (no API key), in-memory JSON (no Supabase yet).

---

## Repo layout (target)

```
src/
  app/                # App Router pages + API routes
    (marketing)/      # home
    search/           # results (map+list)
    homes/[id]/       # listing detail
    saved/ agents/ home-loans/ rent/ sell/ compare/ account/
    api/agent/        # chat + autonomous SSE
    api/...           # search, valuation, image-search, doc-parse
  components/
    ds/               # ported design-system components (Button, PropertyCard, ...)
    app/              # app chrome (Header, Footer, Copilot, FAB, Map)
  lib/
    llm/              # provider router, adapters, embeddings
    agents/           # orchestrator, specialists, tools
    data/             # repository interface + JSON & Supabase impls, search
    domain/           # types
  data/generated/     # seed JSON (git-ignored)
scripts/seed.ts       # synthetic data generator
supabase/             # SQL migration (pgvector) for later
```
