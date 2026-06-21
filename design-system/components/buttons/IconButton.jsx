import React from "react";

/**
 * IconButton — 40×40 transparent control with a hover circle.
 * Used for save / share / close and other icon-only actions.
 */
export function IconButton({
  size = 40,
  active = false,
  label,
  children,
  style = {},
  ...rest
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="az-icon-btn"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        border: "none",
        background: "transparent",
        color: active ? "var(--blue-600)" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "background .15s ease, color .15s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-band)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      {...rest}
    >
      {children}
    </button>
  );
}
