"use client";

import Link from "next/link";
import { PropertyCard } from "@/components/ds/property/PropertyCard.jsx";
import type { Listing } from "@/lib/domain/types";
import { fmtPrice, fmtSqft, fullAddress, statusLabel } from "@/lib/format";
import { useSaved } from "./saved-store";

export function ListingCard({ l }: { l: Listing }) {
  const { has, toggle } = useSaved();
  return (
    <Link href={`/homes/${l.id}`} style={{ textDecoration: "none", display: "block" }}>
      <PropertyCard
        photo={l.photos[0]}
        status={l.status}
        statusLabel={statusLabel(l.status)}
        price={fmtPrice(l.price, l.transaction)}
        beds={l.beds}
        baths={l.baths}
        sqft={fmtSqft(l.sqft)}
        homeType={l.homeType}
        address={fullAddress(l)}
        photoCount={`1/${l.photos.length}`}
        attribution={l.attribution}
        priceCut={l.priceCut ? `$${l.priceCut.amount.toLocaleString()} (${l.priceCut.date})` : undefined}
        saved={has(l.id)}
        onSave={() => toggle(l.id)}
      />
    </Link>
  );
}
