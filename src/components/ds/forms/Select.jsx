"use client";
import React from "react";

/**
 * Select — trigger with a trailing chevron that opens a shadow menu.
 * Controlled by `value`; pass `options` as [{value,label}] or strings.
 */
export function Select({ value, options = [], placeholder = "Select", onChange, size = "md", style = {}, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const h = size === "lg" ? 44 : 40;
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const selected = opts.find((o) => o.value === value);

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", ...style }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          minWidth: 160,
          width: "100%",
          height: h,
          padding: "0 12px",
          background: "var(--white)",
          border: `1px solid ${open ? "var(--blue-600)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          boxShadow: open ? "var(--focus-ring)" : "none",
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          color: selected ? "var(--text-primary)" : "var(--text-muted)",
          cursor: "pointer",
        }}
        {...rest}
      >
        {selected ? selected.label : placeholder}
        <span style={{ fontSize: 10, opacity: 0.7, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            margin: 0,
            padding: 4,
            listStyle: "none",
            background: "var(--white)",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: 50,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {opts.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => { onChange && onChange(o.value); setOpen(false); }}
              style={{
                padding: "8px 10px",
                fontSize: 14,
                borderRadius: 6,
                cursor: "pointer",
                color: "var(--text-primary)",
                background: o.value === value ? "var(--blue-50)" : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-zebra)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = o.value === value ? "var(--blue-50)" : "transparent")}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
