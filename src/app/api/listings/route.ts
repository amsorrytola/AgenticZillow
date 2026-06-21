import type { NextRequest } from "next/server";
import { repo } from "@/lib/data/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { ids } = (await req.json().catch(() => ({ ids: [] }))) as { ids?: string[] };
  const listings = await repo.byIds(Array.isArray(ids) ? ids : []);
  return Response.json({ listings });
}
