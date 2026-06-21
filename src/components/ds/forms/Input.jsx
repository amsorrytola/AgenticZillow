"use client";
import React from "react";

/**
 * Input — text field with optional leading icon and clear button.
 * 40px height, 1px border, focus ring. Use for search & forms.
 */
export function Input({
  iconLeft = null,
  clearable = false,
  onClear,
  error = false,
  size = "md",
  style = {},
  wrapStyle = {},
  value,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const h = size === "lg" ? 44 : 40;
  const borderColor = error
    ? "var(--error)"
    : focused
    ? "var(--blue-600)"
    : "var(--border-default)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: h,
        padding: "0 12px",
        background: "var(--white)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-sm)",
        boxShadow: focused ? "var(--focus-ring)" : "none",
        transition: "border-color .15s ease, box-shadow .15s ease",
        ...wrapStyle,
      }}
    >
      {iconLeft && (
        <span style={{ display: "flex", color: "var(--text-muted)", flex: "none" }}>{iconLeft}</span>
      )}
      <input
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          color: "var(--text-primary)",
          ...style,
        }}
        {...rest}
      />
      {clearable && value ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={onClear}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: 16,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
