import * as React from "react";

/**
 * Small label chip — feature chips, counts, AI value badges, inline status.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "blue" | "success" | "warning" | "error" | "violet";
  variant?: "solid" | "soft" | "outline";
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
