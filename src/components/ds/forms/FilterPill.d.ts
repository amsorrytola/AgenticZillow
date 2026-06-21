import * as React from "react";

/**
 * Hallmark Zillow filter-bar control: a pill button with a chevron that opens a
 * popover. Turns Zillow blue with a count badge when a filter is applied.
 *
 * @startingPoint section="Core" subtitle="Zillow filter-bar pills" viewport="700x120"
 */
export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  /** Applied state — blue text / border / tint fill. */
  applied?: boolean;
  /** Optional count badge (e.g. Home Type: 3). */
  count?: number | null;
  /** Rotates the chevron 180°. */
  open?: boolean;
  children?: React.ReactNode;
}

export function FilterPill(props: FilterPillProps): JSX.Element;
