// The orchestrator: routes a user message to specialist agents, runs grounded tools,
// streams a Live Activity Timeline, and narrates a concierge-voice reply. LLM usage is
// cost-aware (cheap providers first, Anthropic last) and fully optional — every path
// degrades to deterministic behavior when no provider key is set.

import type {
  AgentEvent,
  AgentName,
  AgentStep,
  Listing,
  SearchFilters,
} from "@/lib/domain/types";
import { repo } from "@/lib/data/repository";
import { fmtPrice, fullAddress } from "@/lib/format";
import { parseQuery, type Intent } from "./nlu";
import {
  toolAffordability,
  toolAnalyzeDeal,
  toolDraftOffer,
  toolMortgage,
  toolNeighborhood,
  toolScheduleTour,
  toolSearch,
  toolValuation,
} from "./tools";
import { anyProviderAvailable, chat, extractJson } from "@/lib/llm/client";

export interface RunInput {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  context?: { page?: string; listingId?: string; metroId?: string };
  mode?: "chat" | "autonomous";
  image?: { mime: string; dataB64: string };
}

let _seq = 0;
const uid = (p: string) => `${p}_${Date.now().toString(36)}_${(_seq++).toString(36)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function planFor(intent: Intent, mode: "chat" | "autonomous"): string[] {
  if (mode === "autonomous")
    return ["Understand goal", "Search inventory", "Analyze top matches", "Rank & shortlist", "Prepare next steps"];
  switch (intent) {
    case "search": return ["Understand request", "Parse filters", "Search listings", "Rank results"];
    case "afford": return ["Understand budget", "Run affordability", "Suggest matches"];
    case "mortgage": return ["Understand loan", "Compute payment"];
    case "value": return ["Locate home", "Estimate value", "Pull comps"];
    case "analyze": return ["Locate home", "Pull comps", "Analyze deal"];
    case "neighborhood": return ["Locate home", "Summarize neighborhood"];
    case "tour": return ["Locate home", "Schedule tour"];
    case "offer": return ["Locate home", "Draft offer"];
    default: return ["Understand request", "Respond"];
  }
}

/** Optional LLM enrichment of intent + semantic phrase (cheap providers first). */
async function llmRefine(message: string): Promise<{ semantic?: string; intentOverride?: Intent } | null> {
  if (!anyProviderAvailable()) return null;
  try {
    const r = await chat(
      [{ role: "user", content: message }],
      {
        task: "route",
        json: true,
        maxTokens: 200,
        temperature: 0,
        system:
          'Extract real-estate search intent. Return ONLY JSON: {"semantic": string|null, "intent": one of ' +
          '"search","afford","mortgage","value","analyze","tour","offer","neighborhood","chat"}. ' +
          'semantic = the qualitative vibe phrase a buyer used (style, ambience, proximity), or null.',
      },
    );
    const j = extractJson<{ semantic?: string; intent?: Intent }>(r.text);
    return { semantic: j?.semantic || undefined, intentOverride: j?.intent };
  } catch {
    return null;
  }
}

export async function* run(input: RunInput): AsyncGenerator<AgentEvent> {
  const mode = input.mode ?? "chat";
  const runId = uid("run");
  let cost = 0;

  // 1) Understand
  const parsed = parseQuery(input.message);
  let intent = parsed.intent;
  let filters: SearchFilters = { ...parsed.filters };
  if (input.context?.metroId && !filters.metroId) filters.metroId = input.context.metroId;

  const plan = planFor(intent, mode);
  yield { type: "run_start", runId, mode, plan };

  const step = (agent: AgentName, label: string, extra?: Partial<AgentStep>): AgentStep => ({
    id: uid("step"), agent, label, status: "running", ...extra,
  });
  async function* doStep(
    agent: AgentName,
    label: string,
    work: () => Promise<Partial<AgentStep> & { result?: unknown }>,
  ): AsyncGenerator<AgentEvent, any> {
    const s = step(agent, label);
    yield { type: "step", step: s };
    const t0 = Date.now();
    await sleep(120);
    let patch: Partial<AgentStep> = {};
    try {
      patch = await work();
    } catch (e) {
      patch = { status: "error", label: `${label} — failed` };
    }
    const done: AgentStep = { ...s, status: "ok", durationMs: Date.now() - t0, ...patch };
    if (done.costUsd) cost += done.costUsd;
    yield { type: "step_update", step: done };
    return done.result;
  }

  // Orchestrator plan step + optional LLM refine
  yield* doStep("orchestrator", `Planning ${plan.length} steps…`, async () => {
    const refine = await llmRefine(input.message);
    if (refine) {
      if (refine.semantic && !filters.semantic) filters.semantic = refine.semantic;
      if (refine.intentOverride && intent === "search") intent = refine.intentOverride;
    }
    return { status: "ok" };
  });

  // Resolve a target listing for listing-scoped intents
  async function resolveTarget(): Promise<Listing | null> {
    if (input.context?.listingId) return repo.getListing(input.context.listingId);
    return null;
  }

  const summaries: string[] = [];
  let resultListings: Listing[] = [];

  // Side-event bridge: steps whose work() needs to emit an extra event (e.g. a
  // simulated action) push it here; we flush the queue after the switch.
  const queue: AgentEvent[] = [];
  function yield_(ev: AgentEvent) { queue.push(ev); }

  // 2) Execute by intent
  if (mode === "autonomous") {
    yield* autonomous(filters);
  } else {
    switch (intent) {
      case "search": {
        yield* doStep("search", "Parsing intent → filters", async () => ({ status: "ok", label: chipLabel(filters) }));
        yield* searchAndEmit(filters);
        break;
      }
      case "afford": {
        const income = guessMoney(input.message) ?? 120000;
        const r = yield* doStep("finance", "Running affordability (36% DTI)", async () => {
          const out = toolAffordability({ annualIncome: income });
          summaries.push(out.summary);
          return { result: out.data, label: out.summary };
        });
        filters.maxPrice = (r as any)?.maxPrice;
        yield* searchAndEmit(filters);
        break;
      }
      case "mortgage": {
        const target = await resolveTarget();
        const price = target?.price ?? guessMoney(input.message) ?? 500000;
        yield* doStep("finance", "Computing monthly payment", async () => {
          const out = toolMortgage({ price, hoaMonthly: target?.hoa ?? 0 });
          summaries.push(out.summary);
          return { result: out.data, label: out.summary };
        });
        break;
      }
      case "value": {
        const target = (await resolveTarget()) ?? resultListings[0];
        if (target) {
          yield* doStep("market", "Estimating value", async () => {
            const out = await toolValuation(target.id);
            summaries.push(out.summary);
            return { result: out.data, label: out.summary };
          });
        } else summaries.push("Open a listing and I'll estimate its value.");
        break;
      }
      case "analyze": {
        const target = (await resolveTarget()) ?? resultListings[0];
        if (target) {
          yield* doStep("market", "Pulling comps & Zestimate deltas…", async () => ({ status: "ok" }));
          yield* doStep("finance", "Analyzing the deal", async () => {
            const out = await toolAnalyzeDeal(target.id);
            summaries.push(out.summary);
            return { result: out.data, label: out.summary };
          });
        } else summaries.push("Pick a home and I'll analyze the deal.");
        break;
      }
      case "neighborhood": {
        const target = (await resolveTarget()) ?? resultListings[0];
        if (target) {
          yield* doStep("neighborhood", "Summarizing the neighborhood", async () => {
            const out = await toolNeighborhood(target.id);
            summaries.push(out.summary);
            return { result: out.data, label: out.summary };
          });
        } else summaries.push("Open a home and I'll summarize its area.");
        break;
      }
      case "tour": {
        const target = await resolveTarget();
        if (target) {
          yield* doStep("concierge", "Scheduling a tour", async () => {
            const out = await toolScheduleTour(target.id, "Saturday at 2:00 PM");
            summaries.push(out.summary);
            yield_({ type: "action", kind: "tour", status: "simulated", detail: out.summary });
            return { result: out.data, label: "Tour requested · Simulated" };
          });
        } else summaries.push("Open a home and I can schedule a tour.");
        break;
      }
      case "offer": {
        const target = await resolveTarget();
        if (target) {
          yield* doStep("concierge", "Drafting an offer", async () => {
            const out = await toolDraftOffer(target.id);
            summaries.push(out.summary);
            yield_({ type: "action", kind: "offer", status: "simulated", detail: out.summary });
            return { result: out.data, label: "Offer drafted · Simulated" };
          });
        } else summaries.push("Open a home and I can draft an offer.");
        break;
      }
      default:
        summaries.push("I can search homes, value a home, check affordability, analyze a deal, or schedule a tour.");
    }
  }

  // flush any queued side events (actions emitted inside steps)
  for (const ev of queue) yield ev;

  // 3) Emit listings to the UI if we have them
  if (resultListings.length) {
    yield { type: "filters", filters, chips: chipsFor(filters) };
    yield { type: "listings", listings: resultListings.slice(0, 24) };
  }

  // 4) Narrate (LLM concierge voice, else templated)
  const reply = await narrate(input.message, summaries, resultListings, intent);
  cost += reply.cost;
  for (const tok of reply.text.match(/\S+\s*/g) ?? [reply.text]) {
    yield { type: "token", text: tok };
    await sleep(12);
  }
  yield { type: "message", role: "assistant", content: reply.text };
  yield { type: "run_end", runId, costUsd: +cost.toFixed(5) };

  // ── inner helpers that need to yield ──
  async function* searchAndEmit(f: SearchFilters): AsyncGenerator<AgentEvent> {
    yield* doStep("search", `Searching ${f.transaction === "rent" ? "rentals" : "homes"}…`, async () => {
      const res = (await toolSearch(f)).data as Awaited<ReturnType<typeof repo.search>>;
      resultListings = res.listings;
      summaries.push(`Found ${res.total} ${f.transaction === "rent" ? "rentals" : "homes"} matching.`);
      return { result: res, label: `${res.total.toLocaleString()} homes${f.semantic ? ` · semantic match` : ""}`, tool: "searchListings" };
    });
  }

  // autonomous mode: chain search → analyze → shortlist → tour
  // (kept as a closure so it can yield events)
  function autonomous(f: SearchFilters) {
    return (async function* (): AsyncGenerator<AgentEvent> {
      yield* searchAndEmit({ ...f, limit: 24 });
      const top = resultListings.slice(0, 3);
      for (const l of top) {
        yield* doStep("market", `Analyzing ${l.address.line1}`, async () => {
          const out = await toolAnalyzeDeal(l.id);
          return { result: out.data, label: `${l.address.line1}: ${out.summary}`, tool: "analyzeDeal" };
        });
      }
      yield* doStep("orchestrator", "Ranking & shortlisting 3 homes", async () => {
        summaries.push(`Shortlisted ${top.length} homes and analyzed each deal.`);
        return { status: "ok" };
      });
      if (top[0]) {
        yield* doStep("concierge", `Requesting a tour of ${top[0].address.line1}`, async () => {
          const out = await toolScheduleTour(top[0].id, "this weekend");
          summaries.push(out.summary);
          return { result: out.data, label: "Tour requested · Simulated", tool: "scheduleTour" };
        });
      }
    })();
  }
}

function chipLabel(f: SearchFilters): string {
  return chipsFor(f).map((c) => c.label).slice(0, 3).join(" · ") || "all homes";
}
function chipsFor(f: SearchFilters): { label: string; byAI?: boolean }[] {
  const c: { label: string; byAI?: boolean }[] = [];
  if (f.homeTypes) for (const t of f.homeTypes) c.push({ label: `${t}s` });
  if (f.beds) c.push({ label: `${f.beds}+ beds` });
  if (f.maxPrice) c.push({ label: `≤ ${fmtPrice(f.maxPrice)}` });
  if (f.minPrice) c.push({ label: `≥ ${fmtPrice(f.minPrice)}` });
  if (f.semantic) c.push({ label: `“${f.semantic.slice(0, 22)}”`, byAI: true });
  if (f.features) for (const ft of f.features) c.push({ label: ft, byAI: true });
  return c;
}

function guessMoney(text: string): number | null {
  const m = text.replace(/[, ]/g, "").match(/\$?(\d+(?:\.\d+)?)([km])/i);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (m[2].toLowerCase() === "k") n *= 1000;
  else if (m[2].toLowerCase() === "m") n *= 1_000_000;
  return Math.round(n);
}

async function narrate(
  message: string,
  summaries: string[],
  listings: Listing[],
  intent: Intent,
): Promise<{ text: string; cost: number }> {
  const facts = summaries.join(" ");
  const top = listings.slice(0, 3).map((l) => `${l.address.line1} (${fmtPrice(l.price, l.transaction)})`).join("; ");
  if (anyProviderAvailable()) {
    try {
      const r = await chat(
        [
          {
            role: "user",
            content:
              `User asked: "${message}".\nTool findings: ${facts || "none"}.` +
              (top ? `\nTop matches: ${top}.` : ""),
          },
        ],
        {
          task: "reason",
          maxTokens: 220,
          temperature: 0.5,
          system:
            "You are AgenticZillow's concierge. Reply in 2–4 short sentences, warm and practical. " +
            "Start with a brief acknowledgement (e.g. 'On it.'). Restate what you found, reference the top matches if any, " +
            "and offer one concrete next step (analyze a deal, schedule a tour, refine the search). " +
            "Never invent data beyond the findings. If an action was simulated, keep the honest 'Simulated for demo' framing.",
        },
      );
      if (r.text.trim()) return { text: r.text.trim(), cost: r.costUsd };
    } catch {
      // fall through
    }
  }
  // templated fallback
  let text = "On it. ";
  if (facts) text += facts + " ";
  if (top) text += `Top matches: ${top}. `;
  text += intent === "search"
    ? "Want me to analyze the best deal or schedule a tour?"
    : "What would you like to do next?";
  return { text: text.trim(), cost: 0 };
}
