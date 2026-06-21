import type { NextRequest } from "next/server";
import { repo } from "@/lib/data/repository";
import { parseQuery } from "@/lib/agents/nlu";
import type { SearchFilters } from "@/lib/domain/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { filters } — direct structured search.
export async function POST(req: NextRequest) {
  const filters = (await req.json().catch(() => ({}))) as SearchFilters;
  const res = await repo.search(filters);
  return Response.json(res);
}

// GET ?q=natural+language&metroId=...&transaction=buy — conversational search.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = sp.get("q") ?? "";
  let filters: SearchFilters = q ? parseQuery(q).filters : {};
  for (const key of ["metroId", "transaction"] as const) {
    const v = sp.get(key);
    if (v) (filters as any)[key] = v;
  }
  const num = (k: keyof SearchFilters) => {
    const v = sp.get(k as string);
    if (v != null) (filters as any)[k] = Number(v);
  };
  num("minPrice"); num("maxPrice"); num("beds"); num("baths");
  if (sp.get("sort")) filters.sort = sp.get("sort") as SearchFilters["sort"];
  const res = await repo.search(filters);
  return Response.json(res);
}
