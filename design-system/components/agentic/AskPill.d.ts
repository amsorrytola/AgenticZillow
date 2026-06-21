import * as React from "react";

/**
 * The single branded AI doorway — blue→violet gradient ✦ pill. Lives in the
 * header; as `fab` it's the floating bottom-right launcher with an optional
 * proactive-item count badge. This is the ONLY place the agentic gradient is used.
 */
export interface AskPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  /** Render as the circular floating launcher instead of the header pill. */
  fab?: boolean;
  /** Proactive-item count badge (fab only). */
  badge?: number | null;
}

export function AskPill(props: AskPillProps): JSX.Element;
