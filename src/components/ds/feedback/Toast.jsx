"use client";
import React from "react";

/**
 * Toast — white card with a leading status icon, message, and optional action.
 * Bottom-center/left, shadow-lg, auto-dismiss in the app (presentational here).
 */
export function Toast({ tone = "success", icon = null, children, action, onAction, style = {}, ...rest }) {
  const dot = {
    success: "var(--success)",
    error: "var(--error)",
    info: "var(--blue-600)",
    neutral: "var(--gray-700)",
  }[tone];

  return (
    <div
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "var(--white)",
        borderRadius: "var(--radius-sm)",
        boxShadow: "var(--shadow-lg)",
        fontSize: 14,
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dot,
          flex: "none",
        }}
      />
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
      {action && (
        <button
          type="button"
          onClick={onAction}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--blue-600)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
