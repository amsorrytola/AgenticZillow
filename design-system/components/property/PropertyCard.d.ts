import * as React from "react";

/**
 * The signature Zillow property card — photo, status tag, save heart, price,
 * meta line, address, optional price-cut + broker attribution, and a subtle
 * agentic "Is this a good deal?" chip on hover.
 *
 * @startingPoint section="Property" subtitle="The signature Zillow listing card" viewport="320x400"
 */
export interface PropertyCardProps extends React.HTMLAttributes<HTMLElement> {
  photo?: string;
  status?: "for-sale" | "for-rent" | "pending" | "contingent" | "coming-soon" | "new" | "sold" | "tour" | "open-house";
  statusLabel?: string;
  /** Pre-formatted price string, e.g. "$625,000" or "$2,400/mo". */
  price?: string;
  beds?: number | string;
  baths?: number | string;
  sqft?: number | string;
  homeType?: string;
  address?: string;
  saved?: boolean;
  onSave?: () => void;
  /** e.g. "1/24" — shown with a camera icon. */
  photoCount?: string;
  /** e.g. "$10,000 (Apr 12)". */
  priceCut?: string;
  /** Broker attribution line. */
  attribution?: string;
  /** Show the hover "Is this a good deal?" agentic chip. Default true. */
  agentic?: boolean;
}

export function PropertyCard(props: PropertyCardProps): JSX.Element;
