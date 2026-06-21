"use client";

import { useEffect } from "react";
import { useCopilot } from "./copilot";

/** Drop into a page (server or client) to make the Copilot page-aware. */
export function CopilotContext(props: { page?: string; listingId?: string; metroId?: string; greeting?: string }) {
  const { setContext } = useCopilot();
  useEffect(() => {
    setContext(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.page, props.listingId, props.metroId, props.greeting]);
  return null;
}
