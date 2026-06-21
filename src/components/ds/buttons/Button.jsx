"use client";
import React from "react";

/**
 * AgenticZillow Button — the brand's primary action control.
 * Zillow-blue fill primary; outline / ghost / text / destructive variants.
 */
export function Button({
  variant = "primary",
  size = "md",
  pill = false,
  disabled = false,
  block = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { height: 32, padding: "0 14px", font: 13 },
    md: { height: 40, padding: "0 20px", font: 14 },
    lg: { height: 48, padding: "0 28px", font: 16 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: s.height,
    padding: s.padding,
    fontSize: s.font,
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    lineHeight: 1,
    borderRadius: pill ? "var(--radius-pill)" : "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    width: block ? "100%" : "auto",
    whiteSpace: "nowrap",
    transition: "background .15s ease, border-color .15s ease, color .15s ease",
    userSelect: "none",
  };

  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "var(--text-on-blue)",
    },
    secondary: {
      background: "var(--white)",
      color: "var(--blue-600)",
      borderColor: "var(--blue-600)",
    },
    ghost: {
      background: "transparent",
      color: "var(--blue-600)",
    },
    text: {
      background: "transparent",
      color: "var(--blue-600)",
      padding: "0 4px",
      height: "auto",
    },
    destructive: {
      background: "var(--error)",
      color: "var(--white)",
    },
    agentic: {
      background: "var(--agentic-gradient)",
      color: "var(--white)",
    },
  };

  const disabledStyle = disabled
    ? { background: "var(--border-hairline)", color: "var(--text-disabled)", borderColor: "transparent" }
    : {};

  return (
    <button
      type="button"
      disabled={disabled}
      data-variant={variant}
      className="az-btn"
      style={{ ...base, ...variants[variant], ...disabledStyle, ...style }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
