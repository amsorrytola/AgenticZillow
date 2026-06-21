import * as React from "react";

/**
 * Zillow map price-bubble pin — rounded pill with a downward tail.
 * State conveys read/saved status: default (blue), viewed (dim gray),
 * saved (magenta + heart), shortlisted (gold + star, agent picks).
 */
export interface PriceBubbleProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Pre-formatted, e.g. "$625K". */
  price?: string;
  state?: "default" | "viewed" | "saved" | "shortlisted";
}

export function PriceBubble(props: PriceBubbleProps): JSX.Element;
