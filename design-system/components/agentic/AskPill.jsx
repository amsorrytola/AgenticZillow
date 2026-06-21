import React from "react";

/**
 * AskPill — the ONE branded AI entry point. Blue→violet gradient pill with the
 * ✦ sparkle. Used in the header and (as `fab`) the floating launcher.
 */
export function AskPill({ label = "Ask AgenticZillow", fab = false, badge = null, style = {}, ...rest }) {
  if (fab) {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        className="az-ask-fab"
        style={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: "var(--radius-pill)",
          border: "none",
          background: "var(--agentic-gradient)",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "var(--shadow-lg)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
        {...rest}
      >
        ✦
        {badge != null && (
          <span style={{ position: "absolute", top: -2, right: -2, minWidth: 20, height: 20, padding: "0 5px", borderRadius: "var(--radius-pill)", background: "var(--error)", color: "#fff", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{badge}</span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="az-ask-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 40,
        padding: "0 16px",
        borderRadius: "var(--radius-pill)",
        border: "none",
        background: "var(--agentic-gradient)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 1px 2px rgba(91,63,217,0.35)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ fontSize: 15 }}>✦</span>
      {label}
    </button>
  );
}
