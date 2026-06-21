import React from "react";

/**
 * FilterPill — the hallmark Zillow filter control.
 * White pill with chevron; turns blue (applied) with an optional count badge.
 */
export function FilterPill({
  label,
  applied = false,
  count = null,
  open = false,
  children,
  style = {},
  ...rest
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      className="az-filter-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 36,
        padding: "0 12px",
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "var(--font-sans)",
        background: applied ? "var(--blue-100)" : "var(--white)",
        color: applied ? "var(--blue-600)" : "var(--text-primary)",
        border: `1px solid ${applied ? "var(--blue-600)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background .15s, border-color .15s, color .15s",
        ...style,
      }}
      {...rest}
    >
      {children || label}
      {count != null && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 18,
            height: 18,
            padding: "0 5px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--white)",
            background: "var(--blue-600)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {count}
        </span>
      )}
      <span
        style={{
          fontSize: 10,
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform .15s ease",
          opacity: 0.7,
        }}
      >
        ▾
      </span>
    </button>
  );
}
