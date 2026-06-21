import React from "react";

/**
 * Checkbox — square 18px control with Zillow-blue fill when checked.
 */
export function Checkbox({ checked = false, label, disabled = false, onChange, style = {}, ...rest }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontSize: 14,
        fontFamily: "var(--font-sans)",
        color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          flex: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          border: `1px solid ${checked ? "var(--blue-600)" : "var(--border-default)"}`,
          background: checked ? "var(--blue-600)" : "var(--white)",
          color: "var(--white)",
          transition: "background .12s, border-color .12s",
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2 5 8.6 9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {label}
    </label>
  );
}
