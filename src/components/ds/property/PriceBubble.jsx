"use client";
import React from "react";

/**
 * PriceBubble — the Zillow map price-bubble pin. Rounded pill with a downward
 * tail. Unviewed = blue; viewed = dimmed gray; saved = magenta heart accent.
 */
export function PriceBubble({ price = "$0", state = "default", style = {}, ...rest }) {
  const palette = {
    default: { bg: "var(--blue-600)", color: "#fff", border: "var(--blue-600)" },
    viewed: { bg: "#fff", color: "var(--tag-sold)", border: "var(--border-default)" },
    saved: { bg: "var(--error)", color: "#fff", border: "var(--error)" },
    shortlisted: { bg: "var(--warning)", color: "#2A2A33", border: "var(--warning)" },
  };
  const p = palette[state] || palette.default;

  return (
    <span
      className="az-price-bubble az-stat"
      style={{ position: "relative", display: "inline-block", filter: "drop-shadow(var(--shadow-pin))", ...style }}
      {...rest}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          height: 26,
          padding: "0 10px",
          background: p.bg,
          color: p.color,
          border: `1px solid ${p.border}`,
          borderRadius: "var(--radius-pill)",
          fontSize: 13,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {state === "saved" && <span style={{ fontSize: 11 }}>♥</span>}
        {state === "shortlisted" && <span style={{ fontSize: 11 }}>★</span>}
        {price}
      </span>
      {/* tail */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          bottom: -5,
          transform: "translateX(-50%) rotate(45deg)",
          width: 8,
          height: 8,
          background: p.bg,
          borderRight: `1px solid ${p.border}`,
          borderBottom: `1px solid ${p.border}`,
        }}
      />
    </span>
  );
}
