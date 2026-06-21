"use client";

import { Button } from "@/components/ds/buttons/Button.jsx";
import { useCopilot } from "./copilot";

export function RequestTourButton({ block }: { block?: boolean }) {
  const { ask } = useCopilot();
  return (
    <Button block={block} onClick={() => ask("Schedule a tour of this home for this weekend")}>
      Request a tour
    </Button>
  );
}
