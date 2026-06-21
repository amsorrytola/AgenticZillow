import React from "react";

/**
 * Badge / Tag — small label chip. `tone` sets the color family;
 * `variant` = solid | soft | outline. Use for feature chips, counts, status text.
 */
export function Badge({ tone = "neutral", variant = "soft", children, style = {}, ...rest }) {
  const tones = {
    neutral: { solid: "var(--gray-700)", soft: "var(--surface-band)", softText: "var(--text-secondary)", border: "var(--border-default)" },
    blue: { solid: "var(--blue-600)", soft: "var(--blue-100)", softText: "var(--blue-600)", border: "var(--blue-600)" },
    success: { solid: "var(--success)", soft: "var(--success-fill)", softText: "var(--success)", border: "var(--success)" },
    warning: { solid: "var(--warning)", soft: "var(--warning-fill)", softText: "#8A6200", border: "var(--warning)" },
    error: { solid: "var(--error)", soft: "var(--error-fill)", softText: "var(--error)", border: "var(--error)" },
    violet: { solid: "var(--violet)", soft: "#EFE6FF", softText: "#6B34D6", border: "var(--violet)" },
  };
  const t = tones[tone] || tones.neutral;

  const styles = {
    solid: { background: t.solid, color: "var(--white)", border: "1px solid transparent" },
    soft: { background: t.soft, color: t.softText, border: "1px solid transparent" },
    outline: { background: "var(--white)", color: t.softText, border: `1px solid ${t.border}` },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 22,
        padding: "0 9px",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...styles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
