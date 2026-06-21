import React from "react";

const TAG_COLORS = {
  "for-sale": { dot: "var(--tag-for-sale)", label: "For Sale" },
  "for-rent": { dot: "var(--tag-for-sale)", label: "For Rent" },
  pending: { dot: "var(--tag-pending)", label: "Pending" },
  contingent: { dot: "var(--tag-pending)", label: "Contingent" },
  "coming-soon": { dot: "var(--tag-coming-soon)", label: "Coming Soon" },
  new: { dot: "var(--tag-new)", label: "New" },
  sold: { dot: "var(--tag-sold)", label: "Sold" },
  tour: { dot: "var(--tag-tour)", label: "3D Tour" },
  "open-house": { dot: "var(--tag-tour)", label: "Open House" },
};

/**
 * StatusTag — white pill with a colored dot + label for property cards.
 * Status is conveyed by BOTH dot color and text (never color alone).
 */
export function StatusTag({ status = "for-sale", label, style = {}, ...rest }) {
  const cfg = TAG_COLORS[status] || TAG_COLORS["for-sale"];
  return (
    <span
      className="az-status-tag"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 24,
        padding: "0 10px",
        background: "var(--white)",
        borderRadius: "var(--radius-pill)",
        boxShadow: "var(--shadow-xs)",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text-primary)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, flex: "none" }} />
      {label || cfg.label}
    </span>
  );
}
