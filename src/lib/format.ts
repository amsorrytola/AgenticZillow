import type { Listing } from "@/lib/domain/types";

export function fmtPrice(n: number, transaction?: string): string {
  const s = `$${Math.round(n).toLocaleString("en-US")}`;
  return transaction === "rent" ? `${s}/mo` : s;
}

export function fmtPriceShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, "")}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function fmtSqft(n: number): string {
  return n.toLocaleString("en-US");
}

export function metaLine(l: Listing): string {
  const parts = [
    `${l.beds} bds`,
    `${l.baths} ba`,
    `${fmtSqft(l.sqft)} sqft`,
  ];
  return `${parts.join("  |  ")}  -  ${l.homeType}`;
}

export function fullAddress(l: Listing): string {
  return `${l.address.line1}, ${l.address.city}, ${l.address.state} ${l.address.zip}`;
}

export function statusLabel(status: Listing["status"]): string {
  switch (status) {
    case "for-sale": return "For Sale";
    case "new": return "New";
    case "pending": return "Pending";
    case "coming-soon": return "Coming Soon";
    case "sold": return "Sold";
    case "tour": return "3D Tour";
  }
}
