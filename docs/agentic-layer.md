# The Agentic Layer

> What turns **AgenticZillow** from a Zillow clone into something more.
> Principle: **"Zillow at rest, AgenticZillow in motion."** The UI reads as ordinary
> Zillow until you type intent, open the copilot, or hit Autopilot — then the same
> surfaces come alive with a streaming, multi-agent experience.

Everything below is real and running in the app (see the file links). The agent layer
is **additive and reversible** — dismiss every AI surface and you're left with a
faithful Zillow.

---

## TL;DR — the 7 things the agentic layer adds

1. **A multi-agent orchestrator** that routes each request to specialist agents.
2. **A grounded tool catalog** so agents compute real numbers (mortgage, comps, ROI) instead of hallucinating them.
3. **A cost-aware multi-provider LLM router** — cheap/fast models first, **Anthropic last**.
4. **Streaming + a Live Activity Timeline** that shows the agent's plan, tool calls, provider/model, and cost in real time.
5. **Hybrid search** — structured filters fused with vector (semantic) search.
6. **Page-aware agent UX surfaces** — a persistent copilot, conversational search, inline listing AI, and a proactive feed.
7. **A fully autonomous mode** (Autopilot) that chains multiple steps on its own, with simulated real-world actions.

---

## 1. Multi-agent architecture

A coordinating **Orchestrator** classifies intent, builds a plan, and delegates to
specialist agents. Each agent owns a slice of the domain and a set of tools.

| Agent | Glyph | Responsibility |
| --- | --- | --- |
| **Orchestrator** | 🧭 | Intent routing, planning, the autonomous loop, final narration |
| **Search Agent** | 🔎 | Natural-language → filters, hybrid + semantic search |
| **Market / Investment Analyst** | 📈 | Valuation (Zestimate-style), comparables, deal analysis, ROI |
| **Finance / Mortgage Agent** | 💰 | Monthly payment, affordability (DTI), down-payment scenarios |
| **Tour / Transaction Concierge** | 📅 | Scheduling tours, drafting offers (simulated) |
| **Neighborhood Agent** | 🏘️ | Walk score, schools, commute, area summaries |

Code: [`src/lib/agents/orchestrator.ts`](../src/lib/agents/orchestrator.ts) ·
[`src/lib/agents/nlu.ts`](../src/lib/agents/nlu.ts) ·
[`src/lib/agents/tools.ts`](../src/lib/agents/tools.ts).
Glyphs/labels: `AGENT_META` in [`src/lib/domain/types.ts`](../src/lib/domain/types.ts).

### Orchestrator flow

```
user message
   │
   ▼
1. Understand   → nlu.parseQuery() (deterministic)  ─┐
                   + optional LLM "route" refine     │  intent + filters
   │                                                 ─┘
   ▼
2. Plan         → planFor(intent, mode)  → ["Parse filters", "Search listings", …]
   │
   ▼
3. Delegate     → run the relevant specialist(s), each emitting timeline steps
   │              and calling grounded tools
   ▼
4. Emit         → filters + listings to the UI
   │
   ▼
5. Narrate      → concierge-voice reply (LLM "reason" task, streamed token-by-token)
   │
   ▼
6. run_end      → total cost
```

Two modes: **`chat`** (answer one request) and **`autonomous`** (chain a goal end-to-end).

---

## 2. Grounded tool catalog

Agents don't ask an LLM to do arithmetic. Every quantitative answer comes from a
deterministic tool over the catalog, which keeps the agent **accurate, fast, and cheap**.
The LLM only *routes* and *narrates*.

| Tool | What it returns |
| --- | --- |
| `toolSearch(filters)` | Hybrid filter + vector search results |
| `toolComps(listingId)` | Nearby comparables + median $/sqft |
| `toolValuation(listingId)` | AI estimate, list-vs-estimate %, value drivers |
| `toolMortgage(input)` | P&I + taxes + insurance + HOA monthly breakdown |
| `toolAffordability(input)` | Max price from income, debts, down payment (36% DTI) |
| `toolAnalyzeDeal(listingId)` | Verdict, cap rate, gross yield, monthly cash flow |
| `toolNeighborhood(listingId)` | Walk score, schools, commute estimate |
| `toolScheduleTour(...)` | **Simulated** tour booking |
| `toolDraftOffer(...)` | **Simulated** offer + drafted letter |

Code: [`src/lib/agents/tools.ts`](../src/lib/agents/tools.ts).

---

## 3. Cost-aware multi-provider LLM router

The single most important infra decision: **route by task complexity and cost, and keep
Anthropic as a last-resort premium fallback** (it's the most expensive). Cheap/fast
providers handle the bulk; the router escalates up the cost ladder only on failure.

| Tier | Provider | Model | Used for |
| --- | --- | --- | --- |
| 0 | **Groq** | llama-3.3-70b | Fast routing / intent extraction |
| 1 | **DeepSeek** | deepseek-chat | Cheap reasoning / narration |
| 1 | **Gemini** | 2.0-flash | Vision + embeddings + reasoning |
| 2 | **OpenAI** | gpt-4o-mini | Mid fallback |
| 3 | **Anthropic** | claude-haiku-4-5 | **Premium fallback only (last)** |

- Each call picks the cheapest *capable + available* provider for its task
  (`route`, `reason`, `vision`, `premium`), then escalates on error.
- A **cost meter** sums real token costs per run and surfaces it in the timeline.
- **Graceful degradation:** with *zero* LLM keys, the orchestrator still works —
  `nlu.ts` parses intent and a templated concierge voice replies. Keys make it nicer,
  never required.
- Embeddings come from Gemini (`text-embedding-004`) for the hosted path, or a
  dependency-free local hashed embedder otherwise.

Code: [`src/lib/llm/providers.ts`](../src/lib/llm/providers.ts) ·
[`src/lib/llm/client.ts`](../src/lib/llm/client.ts).

> A typical chat run costs **~$0.0001** — Groq/Gemini tier. In live testing Anthropic was never hit.

---

## 4. Streaming + the Live Activity Timeline

The orchestrator is an **async generator** of `AgentEvent`s, streamed to the browser as
Server-Sent Events. The Copilot renders them as a chat thread *and* a Live Activity
Timeline (agent tag, status spinner→check, duration, provider, model, cost).

The event protocol (`AgentEvent` in [`src/lib/domain/types.ts`](../src/lib/domain/types.ts)):

| Event | Meaning |
| --- | --- |
| `run_start` | Run began; carries the plan + mode |
| `step` / `step_update` | A timeline row appears / resolves (ok·error, with timing + cost) |
| `token` | A streamed chunk of the assistant reply |
| `message` | The finalized assistant message |
| `listings` | Results to render as cards |
| `filters` | Filters the agent applied (incl. "Applied by AI" chips) |
| `action` | A simulated real-world action |
| `run_end` | Run finished; total cost |
| `error` | Failure surfaced to the UI |

Transport: [`src/app/api/agent/route.ts`](../src/app/api/agent/route.ts) (SSE).
Client renderer: [`src/components/app/copilot.tsx`](../src/components/app/copilot.tsx)
using the design-system `AgentTimelineRow`.

### Example trace (real run)

```
▶ run_start            plan: Understand · Parse filters · Search · Rank
🧭 Orchestrator  0.8s  Planning 4 steps…            (LLM refine → extracted vibe phrase)
🔎 Search        0.1s  Parsing intent → filters      ≤ $700,000 · "cozy craftsman"
🔎 Search        0.1s  Searching homes…              10 homes · semantic match
   listings (10) + filters (with ✦ Applied by AI chip)
   …47 streamed tokens…
💬 "On it. I found 10 craftsman-style homes under $700k in Austin. Top picks: …"
■ run_end              cost $0.00014
```

---

## 5. Hybrid search (filters + vectors)

The Search agent fuses **structured filters** (price, beds, type, bbox, …) with **vector
semantic search**, so fuzzy intent like *"cozy craftsman with character near coffee"*
matches beyond rigid filters.

- Listings carry an embedding; queries are embedded the same way; ranking is cosine
  similarity blended with recency / "best match" / "best deal" sort modes.
- Default embedder is a **dependency-free 256-dim hashed vector** (works with no API key,
  in-memory). The Supabase path stores the same vectors in **pgvector** with a
  `match_listings()` SQL function for scale.

Code: [`src/lib/data/search.ts`](../src/lib/data/search.ts) ·
[`src/lib/data/embed.ts`](../src/lib/data/embed.ts) ·
migration [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).

---

## 6. Agent UX surfaces

The agent shows up across the product without ever repainting the Zillow look:

- **Persistent, page-aware Copilot** (✦ FAB / any "Ask AI"). It knows what page you're on
  and which listing you're viewing, via `CopilotContext`
  ([`src/components/app/CopilotContext.tsx`](../src/components/app/CopilotContext.tsx)).
- **Conversational search bar** — the hero accepts full natural language; submitting
  routes to `/search` where it's parsed into filters + a semantic query, shown as
  "✦ Applied by AI" chips.
- **Inline AI on listings** — "Is this a good deal?", "Analyze this deal", "Summarize the
  neighborhood", "What's my commute?", "Schedule a tour", "Draft an offer"
  ([`src/components/app/InlineAIActions.tsx`](../src/components/app/InlineAIActions.tsx)).
- **Proactive agent feed** — "From your agent" strip on the home page surfacing new
  matches / price drops / below-estimate finds
  ([`src/components/app/ProactiveStrip.tsx`](../src/components/app/ProactiveStrip.tsx)).
- **Map / list hover sync, AI sort modes** ("Best match for me", "Best deal") on the
  search page.

---

## 7. Autonomous mode (Autopilot)

The **✦ Autopilot** button runs the orchestrator in `autonomous` mode: it chains steps on
its own while you watch the timeline:

```
Understand goal → Search inventory → Analyze top 3 deals →
Rank & shortlist → Request a tour on the best (Simulated)
```

Each step streams to the timeline; the final tour booking is clearly badged
**"Simulated for demo."**

---

## Guardrails & honesty

- **Simulated actions only.** Tours and offers go right up to the real-world step and stop,
  returning a `simulated` result the UI badges **"Simulated for demo."** No real bookings,
  no real offers.
- **Grounded math.** Quantitative answers come from deterministic tools, not the LLM.
- **Graceful degradation.** Missing LLM keys → deterministic parsing + templated replies.
  Missing DB → in-memory catalog. The app never hard-fails on a missing dependency.
- **Cost transparency.** Every run reports its real token cost; cheap providers are tried
  first; Anthropic is reserved as a last resort.

---

## File map

| Concern | Location |
| --- | --- |
| Orchestrator + autonomous loop | [`src/lib/agents/orchestrator.ts`](../src/lib/agents/orchestrator.ts) |
| Intent / NL parsing (fallback) | [`src/lib/agents/nlu.ts`](../src/lib/agents/nlu.ts) |
| Grounded tool catalog | [`src/lib/agents/tools.ts`](../src/lib/agents/tools.ts) |
| LLM provider registry + routing | [`src/lib/llm/providers.ts`](../src/lib/llm/providers.ts) |
| Unified LLM client + embeddings | [`src/lib/llm/client.ts`](../src/lib/llm/client.ts) |
| Hybrid + vector search | [`src/lib/data/search.ts`](../src/lib/data/search.ts), [`embed.ts`](../src/lib/data/embed.ts) |
| Streaming SSE endpoint | [`src/app/api/agent/route.ts`](../src/app/api/agent/route.ts) |
| Copilot dock + Live Timeline | [`src/components/app/copilot.tsx`](../src/components/app/copilot.tsx) |
| Event/agent types | [`src/lib/domain/types.ts`](../src/lib/domain/types.ts) |

See also: [`docs/agenticzillow-design-prompt.md`](agenticzillow-design-prompt.md) (full spec)
and [`CLAUDE.md`](../CLAUDE.md) (build tracker).
