import type { NextRequest } from "next/server";
import { run, type RunInput } from "@/lib/agents/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Streams the multi-agent run as Server-Sent Events (AgentEvent JSON per `data:` line).
export async function POST(req: NextRequest) {
  let body: RunInput;
  try {
    body = (await req.json()) as RunInput;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (ev: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
      try {
        for await (const ev of run(body)) send(ev);
      } catch (e) {
        send({ type: "error", message: String(e).slice(0, 200) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
