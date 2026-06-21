// Lightweight, dependency-free text embedding for keyless semantic search.
// Hashes tokens (with bigrams) into a fixed-dimension vector and L2-normalizes.
// Good enough for fuzzy intent matching ("cozy craftsman near coffee") without an
// external embeddings API. Swappable for Gemini embeddings (see src/lib/llm/embeddings.ts).

export const LOCAL_DIM = 256;

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "for", "to", "with", "near",
  "is", "are", "this", "that", "home", "house", "i", "me", "my", "want", "looking",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function localEmbed(text: string, dim = LOCAL_DIM): number[] {
  const v = new Array(dim).fill(0);
  const tokens = tokenize(text);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    v[hash(t) % dim] += 1;
    if (i + 1 < tokens.length) {
      const bigram = t + "_" + tokens[i + 1];
      v[hash(bigram) % dim] += 0.6;
    }
  }
  let norm = 0;
  for (const x of v) norm += x * x;
  norm = Math.sqrt(norm) || 1;
  return v.map((x) => x / norm);
}

export function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot; // inputs are L2-normalized
}
