import * as React from "react";

/**
 * One row of the Live Activity Timeline that streams the multi-agent chain.
 * Shows the agent tag, a one-line label, status (running spinner → green check →
 * amber warning), timing, and an optional model + cost note.
 *
 * Requires a `@keyframes az-spin` rule in the page (provided by the UI kit).
 */
export interface AgentTimelineRowProps extends React.HTMLAttributes<HTMLDivElement> {
  agent?: "orchestrator" | "search" | "market" | "finance" | "concierge";
  label: React.ReactNode;
  status?: "running" | "ok" | "error";
  /** Elapsed/timing string, e.g. "0.8s". */
  time?: string;
  /** Model handling this step, e.g. "Groq · llama-3.3". */
  model?: string;
  /** Running cost, e.g. "$0.012". */
  cost?: string;
}

export function AgentTimelineRow(props: AgentTimelineRowProps): JSX.Element;
