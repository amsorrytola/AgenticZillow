import {
  candidatesFor,
  keyFor,
  PROVIDERS,
  GEMINI_EMBED_MODEL,
  isAvailable,
  type LLMTask,
  type ProviderConfig,
  type ProviderId,
} from "./providers";
import { localEmbed } from "@/lib/data/embed";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
  image?: { mime: string; dataB64: string };
}

export interface LLMOptions {
  task?: LLMTask;
  system?: string;
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  needVision?: boolean;
  /** Force a specific provider (skips routing). */
  provider?: ProviderId;
  timeoutMs?: number;
}

export interface LLMResult {
  text: string;
  provider: ProviderId;
  model: string;
  costUsd: number;
  inTokens: number;
  outTokens: number;
  fellBackTo?: ProviderId[];
}

function splitSystem(messages: LLMMessage[], extra?: string) {
  const sys = messages.filter((m) => m.role === "system").map((m) => m.content);
  if (extra) sys.unshift(extra);
  const rest = messages.filter((m) => m.role !== "system");
  return { system: sys.join("\n\n").trim(), rest };
}

async function fetchJson(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    const body = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${body.slice(0, 300)}`);
    return JSON.parse(body);
  } finally {
    clearTimeout(t);
  }
}

async function callOpenAICompatible(
  cfg: ProviderConfig,
  messages: LLMMessage[],
  opts: LLMOptions,
): Promise<{ text: string; inTokens: number; outTokens: number }> {
  const { system, rest } = splitSystem(messages, opts.system);
  const mapped: any[] = [];
  if (system) mapped.push({ role: "system", content: system });
  for (const m of rest) {
    if (m.image && cfg.id === "openai") {
      mapped.push({
        role: m.role,
        content: [
          { type: "text", text: m.content },
          { type: "image_url", image_url: { url: `data:${m.image.mime};base64,${m.image.dataB64}` } },
        ],
      });
    } else {
      mapped.push({ role: m.role, content: m.content });
    }
  }
  const data = await fetchJson(
    cfg.baseUrl,
    {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${keyFor(cfg.id)}` },
      body: JSON.stringify({
        model: cfg.model,
        messages: mapped,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 1024,
        ...(opts.json ? { response_format: { type: "json_object" } } : {}),
      }),
    },
    opts.timeoutMs ?? 30000,
  );
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    inTokens: data.usage?.prompt_tokens ?? 0,
    outTokens: data.usage?.completion_tokens ?? 0,
  };
}

async function callGemini(
  cfg: ProviderConfig,
  messages: LLMMessage[],
  opts: LLMOptions,
): Promise<{ text: string; inTokens: number; outTokens: number }> {
  const { system, rest } = splitSystem(messages, opts.system);
  const contents = rest.map((m) => {
    const parts: any[] = [{ text: m.content }];
    if (m.image) parts.push({ inlineData: { mimeType: m.image.mime, data: m.image.dataB64 } });
    return { role: m.role === "assistant" ? "model" : "user", parts };
  });
  const url = `${cfg.baseUrl}/${cfg.model}:generateContent?key=${keyFor(cfg.id)}`;
  const data = await fetchJson(
    url,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: {
          temperature: opts.temperature ?? 0.3,
          maxOutputTokens: opts.maxTokens ?? 1024,
          ...(opts.json ? { responseMimeType: "application/json" } : {}),
        },
      }),
    },
    opts.timeoutMs ?? 30000,
  );
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p: any) => p.text ?? "")
    .join("");
  return {
    text,
    inTokens: data.usageMetadata?.promptTokenCount ?? 0,
    outTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
  };
}

async function callAnthropic(
  cfg: ProviderConfig,
  messages: LLMMessage[],
  opts: LLMOptions,
): Promise<{ text: string; inTokens: number; outTokens: number }> {
  const { system, rest } = splitSystem(messages, opts.system);
  const mapped = rest.map((m) => {
    if (m.image) {
      return {
        role: m.role,
        content: [
          { type: "image", source: { type: "base64", media_type: m.image.mime, data: m.image.dataB64 } },
          { type: "text", text: m.content },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });
  const data = await fetchJson(
    cfg.baseUrl,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": keyFor(cfg.id) as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: cfg.model,
        ...(system ? { system } : {}),
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.3,
        messages: mapped,
      }),
    },
    opts.timeoutMs ?? 30000,
  );
  const text = (data.content ?? []).map((c: any) => c.text ?? "").join("");
  return {
    text,
    inTokens: data.usage?.input_tokens ?? 0,
    outTokens: data.usage?.output_tokens ?? 0,
  };
}

async function callProvider(cfg: ProviderConfig, messages: LLMMessage[], opts: LLMOptions) {
  if (cfg.kind === "gemini") return callGemini(cfg, messages, opts);
  if (cfg.kind === "anthropic") return callAnthropic(cfg, messages, opts);
  return callOpenAICompatible(cfg, messages, opts);
}

export function anyProviderAvailable(): boolean {
  return (Object.keys(PROVIDERS) as ProviderId[]).some(isAvailable);
}

/**
 * Cost-aware chat. Tries the cheapest capable provider for the task, escalating up
 * the cost ladder on failure. Anthropic is only reached when explicitly `premium`
 * or every cheaper provider has failed.
 */
export async function chat(messages: LLMMessage[], opts: LLMOptions = {}): Promise<LLMResult> {
  const task = opts.task ?? "route";
  let candidates = opts.provider
    ? [PROVIDERS[opts.provider]].filter((p) => isAvailable(p.id))
    : candidatesFor(task, opts.needVision);

  if (!candidates.length) {
    throw new Error("NO_LLM_PROVIDER");
  }

  const fellBackTo: ProviderId[] = [];
  let lastErr: unknown;
  for (let i = 0; i < candidates.length; i++) {
    const cfg = candidates[i];
    try {
      const r = await callProvider(cfg, messages, opts);
      if (i > 0) fellBackTo.push(...candidates.slice(0, i).map((c) => c.id));
      return {
        text: r.text,
        provider: cfg.id,
        model: cfg.model,
        inTokens: r.inTokens,
        outTokens: r.outTokens,
        costUsd: r.inTokens * cfg.inUsd + r.outTokens * cfg.outUsd,
        fellBackTo: fellBackTo.length ? fellBackTo : undefined,
      };
    } catch (e) {
      lastErr = e;
      // escalate to next (more expensive) provider
    }
  }
  throw new Error(`ALL_PROVIDERS_FAILED: ${String(lastErr).slice(0, 200)}`);
}

/** Tolerant JSON extraction from a model response. */
export function extractJson<T = any>(text: string): T | null {
  if (!text) return null;
  let s = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(s) as T;
  } catch {
    const start = s.search(/[[{]/);
    const end = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]"));
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(s.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Embeddings (Gemini if available, else local hashed vector). For pgvector later. */
export async function embed(text: string): Promise<{ vector: number[]; provider: string }> {
  if (isAvailable("gemini")) {
    try {
      const cfg = PROVIDERS.gemini;
      const url = `${cfg.baseUrl}/${GEMINI_EMBED_MODEL}:embedContent?key=${keyFor("gemini")}`;
      const data = await fetchJson(
        url,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: { parts: [{ text }] } }),
        },
        15000,
      );
      const values = data.embedding?.values;
      if (Array.isArray(values)) return { vector: values, provider: "gemini:text-embedding-004" };
    } catch {
      // fall through to local
    }
  }
  return { vector: localEmbed(text), provider: "local:hashed-256" };
}
