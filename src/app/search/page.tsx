import { Suspense } from "react";
import { SearchClient } from "@/components/app/SearchClient";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--text-muted)" }}>Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
