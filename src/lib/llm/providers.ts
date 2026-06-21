// Provider registry for the cost-aware router.
// Cost order (cheap → expensive): Groq → DeepSeek/Gemini → OpenAI → Anthropic (last).
// Prices are USD per token (per-1M figures in comments). Non-Anthropic prices are
// approximate — verify current before relying on the cost meter.

export type ProviderId = "groq" | "deepseek" | "gemini" | "openai" | "anthropic";

export type Capability = "text" | "vision" | "embed";

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  /** cost tier — lower is cheaper / tried first */
  tier: number;
  envKey: string;
  model: string;
  /** OpenAI-compatible chat-completions endpoint, or "gemini"/"anthropic" native */
  kind: "openai" | "gemini" | "anthropic";
  baseUrl: string;
  caps: Capability[];
  // USD per token
  inUsd: number;
  outUsd: number;
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  groq: {
    id: "groq",
    label: "Groq · llama-3.3-70b",
    tier: 0,
    envKey: "GROQ_API_KEY",
    model: "llama-3.3-70b-versatile",
    kind: "openai",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    caps: ["text"],
    inUsd: 0.59 / 1e6,
    outUsd: 0.79 / 1e6, // verify current
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek · deepseek-chat",
    tier: 1,
    envKey: "DEEPSEEK", // note: legacy env name
    model: "deepseek-chat",
    kind: "openai",
    baseUrl: "https://api.deepseek.com/chat/completions",
    caps: ["text"],
    inUsd: 0.27 / 1e6,
    outUsd: 1.1 / 1e6, // verify current
  },
  gemini: {
    id: "gemini",
    label: "Gemini · 2.0-flash",
    tier: 1,
    envKey: "GEMINI_API_KEY",
    model: "gemini-2.0-flash",
    kind: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    caps: ["text", "vision", "embed"],
    inUsd: 0.1 / 1e6,
    outUsd: 0.4 / 1e6, // verify current
  },
  openai: {
    id: "openai",
    label: "OpenAI · gpt-4o-mini",
    tier: 2,
    envKey: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
    kind: "openai",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    caps: ["text", "vision"],
    inUsd: 0.15 / 1e6,
    outUsd: 0.6 / 1e6, // verify current
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic · claude-haiku-4-5",
    tier: 3, // LAST — premium fallback only
    envKey: "ANTHROPIC_API_KEY",
    model: "claude-haiku-4-5",
    kind: "anthropic",
    baseUrl: "https://api.anthropic.com/v1/messages",
    caps: ["text", "vision"],
    inUsd: 1 / 1e6, // authoritative
    outUsd: 5 / 1e6, // authoritative
  },
};

export const GEMINI_EMBED_MODEL = "text-embedding-004";

export function keyFor(id: ProviderId): string | undefined {
  const cfg = PROVIDERS[id];
  // allow DEEPSEEK or DEEPSEEK_API_KEY
  return process.env[cfg.envKey] || (id === "deepseek" ? process.env.DEEPSEEK_API_KEY : undefined);
}

export function isAvailable(id: ProviderId): boolean {
  return Boolean(keyFor(id));
}

export type LLMTask = "route" | "reason" | "vision" | "premium";

// Ordered candidate lists by task (filtered to available + capable at call time).
const ROUTING: Record<LLMTask, ProviderId[]> = {
  route: ["groq", "gemini", "deepseek", "openai", "anthropic"],
  reason: ["deepseek", "gemini", "groq", "openai", "anthropic"],
  vision: ["gemini", "openai", "anthropic"],
  // premium explicitly opts into the strongest reasoning; still degrades if no key
  premium: ["anthropic", "openai", "deepseek", "gemini", "groq"],
};

export function candidatesFor(task: LLMTask, needVision = false): ProviderConfig[] {
  return ROUTING[task]
    .map((id) => PROVIDERS[id])
    .filter((p) => isAvailable(p.id) && (!needVision || p.caps.includes("vision")));
}

export function listProviderStatus(): { id: ProviderId; label: string; tier: number; available: boolean }[] {
  return (Object.keys(PROVIDERS) as ProviderId[]).map((id) => ({
    id,
    label: PROVIDERS[id].label,
    tier: PROVIDERS[id].tier,
    available: isAvailable(id),
  }));
}
