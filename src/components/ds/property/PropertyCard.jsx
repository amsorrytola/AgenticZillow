"use client";
import React from "react";
import { StatusTag } from "../feedback/StatusTag.jsx";

/**
 * PropertyCard — the most important component. Vertical white card with a photo,
 * status tag, save heart, price, meta line, address, and an agentic deal chip.
 */
export function PropertyCard({
  photo,
  status = "for-sale",
  statusLabel,
  price = "$0",
  beds,
  baths,
  sqft,
  homeType = "House",
  address = "",
  saved = false,
  onSave,
  photoCount,
  priceCut,
  attribution,
  agentic = true,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);

  return (
    <article
      className="az-property-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "box-shadow .18s ease, transform .18s ease",
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {/* Photo */}
      <div style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--surface-band)" }}>
        {photo && (
          <img src={photo} alt={address} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "var(--photo-gradient)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <StatusTag status={status} label={statusLabel} />
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save home"}
          aria-pressed={saved}
          onClick={(e) => { e.stopPropagation(); onSave && onSave(); }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={saved ? "var(--saved-heart)" : "rgba(0,0,0,0.25)"} stroke="#fff" strokeWidth="1.8">
            <path d="M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z" strokeLinejoin="round" />
          </svg>
        </button>
        {photoCount && (
          <span style={{ position: "absolute", bottom: 10, left: 12, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#fff" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3"/></svg>
            {photoCount}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "var(--card-pad)" }}>
        <div className="az-price" style={{ fontSize: "var(--type-price-size)", lineHeight: "var(--type-price-line)", fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
          {price}
        </div>
        <div className="az-stat" style={{ marginTop: 4, fontSize: 14, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
          {[beds && `${beds} bds`, baths && `${baths} ba`, sqft && `${sqft} sqft`].filter(Boolean).join("  |  ")}
          {homeType ? `  -  ${homeType}` : ""}
        </div>
        <div style={{ marginTop: 4, fontSize: 14, color: "var(--text-secondary)" }}>{address}</div>
        {priceCut && (
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: "var(--price-cut)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            ↓ {priceCut}
          </div>
        )}
        {attribution && (
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>{attribution}</div>
        )}

        {/* Agentic add-on */}
        {agentic && (
          <div
            style={{
              marginTop: 12,
              maxHeight: hover ? 36 : 0,
              opacity: hover ? 1 : 0,
              overflow: "hidden",
              transition: "max-height .2s ease, opacity .2s ease, margin .2s ease",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 28,
                padding: "0 12px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--blue-600)",
                border: "1px solid var(--blue-600)",
                borderRadius: "var(--radius-pill)",
                background: "var(--white)",
              }}
            >
              ✦ Is this a good deal?
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
