/* @ds-bundle: {"format":3,"namespace":"AgenticZillowDesignSystem_f8327a","components":[{"name":"AgentTimelineRow","sourcePath":"components/agentic/AgentTimelineRow.jsx"},{"name":"AskPill","sourcePath":"components/agentic/AskPill.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"StatusTag","sourcePath":"components/feedback/StatusTag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"FilterPill","sourcePath":"components/forms/FilterPill.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"PriceBubble","sourcePath":"components/property/PriceBubble.jsx"},{"name":"PropertyCard","sourcePath":"components/property/PropertyCard.jsx"}],"sourceHashes":{"components/agentic/AgentTimelineRow.jsx":"a237135f5ef1","components/agentic/AskPill.jsx":"eff12bc19fb0","components/buttons/Button.jsx":"b80891922675","components/buttons/IconButton.jsx":"aa44d1dcb0dd","components/feedback/Badge.jsx":"333dc93c7d50","components/feedback/StatusTag.jsx":"0c32f23a5068","components/feedback/Toast.jsx":"9a299ac99e41","components/forms/Checkbox.jsx":"a87b45a45e6a","components/forms/FilterPill.jsx":"d085fd2a6e59","components/forms/Input.jsx":"14b07e63b1a1","components/forms/Select.jsx":"719ebd46635f","components/property/PriceBubble.jsx":"a78437bb766f","components/property/PropertyCard.jsx":"8388f01d774e","ui_kits/website/Copilot.jsx":"1329efc3d9b3","ui_kits/website/Footer.jsx":"b87b77a76106","ui_kits/website/Header.jsx":"6422f263c7b6","ui_kits/website/HomeScreen.jsx":"837e78986f5d","ui_kits/website/SearchScreen.jsx":"46fca9ad7fcf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AgenticZillowDesignSystem_f8327a = window.AgenticZillowDesignSystem_f8327a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/agentic/AgentTimelineRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AGENTS = {
  orchestrator: {
    icon: "🧭",
    name: "Orchestrator",
    color: "var(--blue-600)"
  },
  search: {
    icon: "🔎",
    name: "Search Agent",
    color: "var(--blue-600)"
  },
  market: {
    icon: "📈",
    name: "Market Analyst",
    color: "var(--success)"
  },
  finance: {
    icon: "💰",
    name: "Finance Agent",
    color: "var(--violet)"
  },
  concierge: {
    icon: "📅",
    name: "Tour Concierge",
    color: "var(--warning)"
  }
};

/**
 * AgentTimelineRow — one row of the Live Activity Timeline. Agent tag, label,
 * status (running spinner → green check → amber warning), timing, and an
 * optional model/cost note.
 */
function AgentTimelineRow({
  agent = "orchestrator",
  label,
  status = "running",
  time,
  model,
  cost,
  style = {},
  ...rest
}) {
  const a = AGENTS[agent] || AGENTS.orchestrator;
  const statusEl = {
    running: /*#__PURE__*/React.createElement("span", {
      className: "az-spinner",
      style: {
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid var(--border-default)",
        borderTopColor: "var(--blue-600)",
        display: "inline-block",
        animation: "az-spin .7s linear infinite"
      }
    }),
    ok: /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--success)",
        fontSize: 14,
        fontWeight: 700
      }
    }, "\u2713"),
    error: /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--warning)",
        fontSize: 14,
        fontWeight: 700
      }
    }, "!")
  }[status];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "10px 12px",
      borderLeft: `2px solid ${a.color}`,
      background: "var(--white)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      display: "flex",
      justifyContent: "center",
      marginTop: 1
    }
  }, statusEl), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: a.color
    }
  }, a.icon, " ", a.name), time && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      fontVariantNumeric: "tabular-nums"
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, label), (model || cost) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, model && /*#__PURE__*/React.createElement("span", null, "\u24D8 ", model), model && cost && /*#__PURE__*/React.createElement("span", null, " \xB7 "), cost && /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: "tabular-nums"
    }
  }, cost))));
}
Object.assign(__ds_scope, { AgentTimelineRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agentic/AgentTimelineRow.jsx", error: String((e && e.message) || e) }); }

// components/agentic/AskPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AskPill — the ONE branded AI entry point. Blue→violet gradient pill with the
 * ✦ sparkle. Used in the header and (as `fab`) the floating launcher.
 */
function AskPill({
  label = "Ask AgenticZillow",
  fab = false,
  badge = null,
  style = {},
  ...rest
}) {
  if (fab) {
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      "aria-label": label,
      title: label,
      className: "az-ask-fab",
      style: {
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
        ...style
      }
    }, rest), "\u2726", badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -2,
        right: -2,
        minWidth: 20,
        height: 20,
        padding: "0 5px",
        borderRadius: "var(--radius-pill)",
        background: "var(--error)",
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #fff"
      }
    }, badge));
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "az-ask-pill",
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\u2726"), label);
}
Object.assign(__ds_scope, { AskPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agentic/AskPill.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AgenticZillow Button — the brand's primary action control.
 * Zillow-blue fill primary; outline / ghost / text / destructive variants.
 */
function Button({
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
    sm: {
      height: 32,
      padding: "0 14px",
      font: 13
    },
    md: {
      height: 40,
      padding: "0 20px",
      font: 14
    },
    lg: {
      height: 48,
      padding: "0 28px",
      font: 16
    }
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
    userSelect: "none"
  };
  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "var(--text-on-blue)"
    },
    secondary: {
      background: "var(--white)",
      color: "var(--blue-600)",
      borderColor: "var(--blue-600)"
    },
    ghost: {
      background: "transparent",
      color: "var(--blue-600)"
    },
    text: {
      background: "transparent",
      color: "var(--blue-600)",
      padding: "0 4px",
      height: "auto"
    },
    destructive: {
      background: "var(--error)",
      color: "var(--white)"
    },
    agentic: {
      background: "var(--agentic-gradient)",
      color: "var(--white)"
    }
  };
  const disabledStyle = disabled ? {
    background: "var(--border-hairline)",
    color: "var(--text-disabled)",
    borderColor: "transparent"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    "data-variant": variant,
    className: "az-btn",
    style: {
      ...base,
      ...variants[variant],
      ...disabledStyle,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — 40×40 transparent control with a hover circle.
 * Used for save / share / close and other icon-only actions.
 */
function IconButton({
  size = 40,
  active = false,
  label,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    className: "az-icon-btn",
    style: {
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
      ...style
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--surface-band)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge / Tag — small label chip. `tone` sets the color family;
 * `variant` = solid | soft | outline. Use for feature chips, counts, status text.
 */
function Badge({
  tone = "neutral",
  variant = "soft",
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      solid: "var(--gray-700)",
      soft: "var(--surface-band)",
      softText: "var(--text-secondary)",
      border: "var(--border-default)"
    },
    blue: {
      solid: "var(--blue-600)",
      soft: "var(--blue-100)",
      softText: "var(--blue-600)",
      border: "var(--blue-600)"
    },
    success: {
      solid: "var(--success)",
      soft: "var(--success-fill)",
      softText: "var(--success)",
      border: "var(--success)"
    },
    warning: {
      solid: "var(--warning)",
      soft: "var(--warning-fill)",
      softText: "#8A6200",
      border: "var(--warning)"
    },
    error: {
      solid: "var(--error)",
      soft: "var(--error-fill)",
      softText: "var(--error)",
      border: "var(--error)"
    },
    violet: {
      solid: "var(--violet)",
      soft: "#EFE6FF",
      softText: "#6B34D6",
      border: "var(--violet)"
    }
  };
  const t = tones[tone] || tones.neutral;
  const styles = {
    solid: {
      background: t.solid,
      color: "var(--white)",
      border: "1px solid transparent"
    },
    soft: {
      background: t.soft,
      color: t.softText,
      border: "1px solid transparent"
    },
    outline: {
      background: "var(--white)",
      color: t.softText,
      border: `1px solid ${t.border}`
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TAG_COLORS = {
  "for-sale": {
    dot: "var(--tag-for-sale)",
    label: "For Sale"
  },
  "for-rent": {
    dot: "var(--tag-for-sale)",
    label: "For Rent"
  },
  pending: {
    dot: "var(--tag-pending)",
    label: "Pending"
  },
  contingent: {
    dot: "var(--tag-pending)",
    label: "Contingent"
  },
  "coming-soon": {
    dot: "var(--tag-coming-soon)",
    label: "Coming Soon"
  },
  new: {
    dot: "var(--tag-new)",
    label: "New"
  },
  sold: {
    dot: "var(--tag-sold)",
    label: "Sold"
  },
  tour: {
    dot: "var(--tag-tour)",
    label: "3D Tour"
  },
  "open-house": {
    dot: "var(--tag-tour)",
    label: "Open House"
  }
};

/**
 * StatusTag — white pill with a colored dot + label for property cards.
 * Status is conveyed by BOTH dot color and text (never color alone).
 */
function StatusTag({
  status = "for-sale",
  label,
  style = {},
  ...rest
}) {
  const cfg = TAG_COLORS[status] || TAG_COLORS["for-sale"];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "az-status-tag",
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: cfg.dot,
      flex: "none"
    }
  }), label || cfg.label);
}
Object.assign(__ds_scope, { StatusTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusTag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toast — white card with a leading status icon, message, and optional action.
 * Bottom-center/left, shadow-lg, auto-dismiss in the app (presentational here).
 */
function Toast({
  tone = "success",
  icon = null,
  children,
  action,
  onAction,
  style = {},
  ...rest
}) {
  const dot = {
    success: "var(--success)",
    error: "var(--error)",
    info: "var(--blue-600)",
    neutral: "var(--gray-700)"
  }[tone];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: dot,
      flex: "none"
    }
  }), icon, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      border: "none",
      background: "transparent",
      color: "var(--blue-600)",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      padding: 0
    }
  }, action));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Checkbox — square 18px control with Zillow-blue fill when checked.
 */
function Checkbox({
  checked = false,
  label,
  disabled = false,
  onChange,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontSize: 14,
      fontFamily: "var(--font-sans)",
      color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      transition: "background .12s, border-color .12s"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2 5 8.6 9.5 3.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/FilterPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FilterPill — the hallmark Zillow filter control.
 * White pill with chevron; turns blue (applied) with an optional count badge.
 */
function FilterPill({
  label,
  applied = false,
  count = null,
  open = false,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-expanded": open,
    className: "az-filter-pill",
    style: {
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
      ...style
    }
  }, rest), children || label, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
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
      borderRadius: "var(--radius-pill)"
    }
  }, count), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform .15s ease",
      opacity: 0.7
    }
  }, "\u25BE"));
}
Object.assign(__ds_scope, { FilterPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FilterPill.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — text field with optional leading icon and clear button.
 * 40px height, 1px border, focus ring. Use for search & forms.
 */
function Input({
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
  const borderColor = error ? "var(--error)" : focused ? "var(--blue-600)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
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
      ...wrapStyle
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: "var(--text-muted)",
      flex: "none"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: 14,
      fontFamily: "var(--font-sans)",
      color: "var(--text-primary)",
      ...style
    }
  }, rest)), clearable && value ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Clear",
    onClick: onClear,
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--text-muted)",
      fontSize: 16,
      lineHeight: 1,
      padding: 0
    }
  }, "\u2715") : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — trigger with a trailing chevron that opens a shadow menu.
 * Controlled by `value`; pass `options` as [{value,label}] or strings.
 */
function Select({
  value,
  options = [],
  placeholder = "Select",
  onChange,
  size = "md",
  style = {},
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const h = size === "lg" ? 44 : 40;
  const opts = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  const selected = opts.find(o => o.value === value);
  React.useEffect(() => {
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      display: "inline-block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    onClick: () => setOpen(o => !o),
    style: {
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
      cursor: "pointer"
    }
  }, rest), selected ? selected.label : placeholder, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      opacity: 0.7,
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform .15s"
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("ul", {
    role: "listbox",
    style: {
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
      overflowY: "auto"
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("li", {
    key: o.value,
    role: "option",
    "aria-selected": o.value === value,
    onClick: () => {
      onChange && onChange(o.value);
      setOpen(false);
    },
    style: {
      padding: "8px 10px",
      fontSize: 14,
      borderRadius: 6,
      cursor: "pointer",
      color: "var(--text-primary)",
      background: o.value === value ? "var(--blue-50)" : "transparent"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--surface-zebra)",
    onMouseLeave: e => e.currentTarget.style.background = o.value === value ? "var(--blue-50)" : "transparent"
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/property/PriceBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PriceBubble — the Zillow map price-bubble pin. Rounded pill with a downward
 * tail. Unviewed = blue; viewed = dimmed gray; saved = magenta heart accent.
 */
function PriceBubble({
  price = "$0",
  state = "default",
  style = {},
  ...rest
}) {
  const palette = {
    default: {
      bg: "var(--blue-600)",
      color: "#fff",
      border: "var(--blue-600)"
    },
    viewed: {
      bg: "#fff",
      color: "var(--tag-sold)",
      border: "var(--border-default)"
    },
    saved: {
      bg: "var(--error)",
      color: "#fff",
      border: "var(--error)"
    },
    shortlisted: {
      bg: "var(--warning)",
      color: "#2A2A33",
      border: "var(--warning)"
    }
  };
  const p = palette[state] || palette.default;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "az-price-bubble az-stat",
    style: {
      position: "relative",
      display: "inline-block",
      filter: "drop-shadow(var(--shadow-pin))",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      height: 26,
      padding: "0 10px",
      background: p.bg,
      color: p.color,
      border: `1px solid ${p.border}`,
      borderRadius: "var(--radius-pill)",
      fontSize: 13,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, state === "saved" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "\u2665"), state === "shortlisted" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "\u2605"), price), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      bottom: -5,
      transform: "translateX(-50%) rotate(45deg)",
      width: 8,
      height: 8,
      background: p.bg,
      borderRight: `1px solid ${p.border}`,
      borderBottom: `1px solid ${p.border}`
    }
  }));
}
Object.assign(__ds_scope, { PriceBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/property/PriceBubble.jsx", error: String((e && e.message) || e) }); }

// components/property/PropertyCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PropertyCard — the most important component. Vertical white card with a photo,
 * status tag, save heart, price, meta line, address, and an agentic deal chip.
 */
function PropertyCard({
  photo,
  status = "for-sale",
  statusLabel,
  price = "$0",
  beds,
  baths,
  sqft,
  homeType = "House",
  address = "",
  saved = false,
  onSave,
  photoCount,
  priceCut,
  attribution,
  agentic = true,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", _extends({
    className: "az-property-card",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-sm)",
      overflow: "hidden",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "box-shadow .18s ease, transform .18s ease",
      cursor: "pointer",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      background: "var(--surface-band)"
    }
  }, photo && /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: address,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-gradient)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusTag, {
    status: status,
    label: statusLabel
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": saved ? "Remove from saved" : "Save home",
    "aria-pressed": saved,
    onClick: e => {
      e.stopPropagation();
      onSave && onSave();
    },
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: saved ? "var(--saved-heart)" : "rgba(0,0,0,0.25)",
    stroke: "#fff",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z",
    strokeLinejoin: "round"
  }))), photoCount && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 10,
      left: 12,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 12,
      fontWeight: 600,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "6",
    width: "18",
    height: "13",
    rx: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12.5",
    r: "3"
  })), photoCount)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--card-pad)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-price",
    style: {
      fontSize: "var(--type-price-size)",
      lineHeight: "var(--type-price-line)",
      fontWeight: 700,
      color: "var(--text-primary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, price), /*#__PURE__*/React.createElement("div", {
    className: "az-stat",
    style: {
      marginTop: 4,
      fontSize: 14,
      color: "var(--text-secondary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, [beds && `${beds} bds`, baths && `${baths} ba`, sqft && `${sqft} sqft`].filter(Boolean).join("  |  "), homeType ? `  -  ${homeType}` : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 14,
      color: "var(--text-secondary)"
    }
  }, address), priceCut && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 13,
      fontWeight: 600,
      color: "var(--price-cut)",
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, "\u2193 ", priceCut), attribution && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, attribution), agentic && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      maxHeight: hover ? 36 : 0,
      opacity: hover ? 1 : 0,
      overflow: "hidden",
      transition: "max-height .2s ease, opacity .2s ease, margin .2s ease"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 28,
      padding: "0 12px",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--blue-600)",
      border: "1px solid var(--blue-600)",
      borderRadius: "var(--radius-pill)",
      background: "var(--white)"
    }
  }, "\u2726 Is this a good deal?"))));
}
Object.assign(__ds_scope, { PropertyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/property/PropertyCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Copilot.jsx
try { (() => {
// AgenticZillow Copilot — page-aware right-side slide-over dock with a chat
// thread, suggested-prompt chips and a Live Activity Timeline tab.
const {
  Button,
  AgentTimelineRow
} = window.AgenticZillowDesignSystem_f8327a;
const SUGGESTED = ["Is this a good deal?", "What can I afford?", "Best neighborhoods for me", "Summarize the neighborhood", "Draft an offer"];
function AZCopilot({
  open,
  onClose
}) {
  const [tab, setTab] = React.useState("chat");
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !open,
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
      width: 400,
      zIndex: 1100,
      background: "#fff",
      boxShadow: "var(--shadow-lg)",
      borderLeft: "1px solid var(--border-hairline)",
      transform: open ? "translateX(0)" : "translateX(110%)",
      transition: "transform .26s cubic-bezier(.4,0,.2,1)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 12px",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 15,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "var(--agentic-gradient)",
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13
    }
  }, "\u2726"), "AgenticZillow"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Close",
    onClick: onClose,
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 18,
      color: "var(--text-muted)"
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontSize: 13,
      color: "var(--text-secondary)",
      lineHeight: "18px"
    }
  }, "You're on the home page \u2014 want me to find homes, value yours, or check what you can afford?")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      padding: "8px 16px 0",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, [["chat", "Chat"], ["timeline", "Activity"]].map(([k, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "8px 10px",
      fontSize: 13,
      fontWeight: 600,
      color: tab === k ? "var(--blue-600)" : "var(--text-muted)",
      borderBottom: tab === k ? "2px solid var(--blue-600)" : "2px solid transparent",
      marginBottom: -1
    }
  }, lbl))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 16
    }
  }, tab === "chat" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start",
      maxWidth: "85%",
      background: "var(--surface-band)",
      borderRadius: "4px 14px 14px 14px",
      padding: "10px 14px",
      fontSize: 14,
      color: "var(--text-primary)",
      lineHeight: "20px"
    }
  }, "On it. I can search listings, analyze a deal, or estimate your budget. What are you hoping to do today?"), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-end",
      maxWidth: "85%",
      background: "var(--blue-600)",
      color: "#fff",
      borderRadius: "14px 4px 14px 14px",
      padding: "10px 14px",
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Find a cozy craftsman under $700k near good coffee in Austin."), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start",
      maxWidth: "90%",
      background: "var(--surface-band)",
      borderRadius: "4px 14px 14px 14px",
      padding: "10px 14px",
      fontSize: 14,
      color: "var(--text-primary)",
      lineHeight: "20px"
    }
  }, "Looking for a cozy craftsman under $700k near good coffee in Austin \u2014 on it. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--blue-600)",
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "See the agent activity \u2192"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(AgentTimelineRow, {
    agent: "orchestrator",
    label: "Planning 5 steps\u2026",
    status: "ok",
    time: "0.4s"
  }), /*#__PURE__*/React.createElement(AgentTimelineRow, {
    agent: "search",
    label: "Parsing intent \u2192 filters (\u2264$700k, craftsman)",
    status: "ok",
    time: "0.9s"
  }), /*#__PURE__*/React.createElement(AgentTimelineRow, {
    agent: "search",
    label: "Semantic search 'craftsman, caf\xE9s' \u2026 41 hits",
    status: "ok",
    time: "1.6s"
  }), /*#__PURE__*/React.createElement(AgentTimelineRow, {
    agent: "market",
    label: "Pulling comps & Zestimate deltas\u2026",
    status: "running",
    model: "Groq \xB7 llama-3.3",
    cost: "$0.012"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px 10px",
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, SUGGESTED.slice(0, 3).map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--blue-600)",
      border: "1px solid var(--blue-600)",
      borderRadius: 9999,
      padding: "5px 11px",
      cursor: "pointer"
    }
  }, "\u2726 ", c))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      border: "1px solid var(--border-default)",
      borderRadius: 9999,
      padding: "4px 4px 4px 14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      cursor: "pointer",
      fontSize: 16
    }
  }, "\uD83D\uDCCE"), /*#__PURE__*/React.createElement("input", {
    placeholder: "Ask AgenticZillow\u2026",
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: 14,
      fontFamily: "var(--font-sans)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      cursor: "pointer",
      fontSize: 16
    }
  }, "\uD83C\uDFA4"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Send",
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      border: "none",
      background: "var(--blue-600)",
      color: "#fff",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  }))))));
}
window.AZCopilot = AZCopilot;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Copilot.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// AgenticZillow website footer — dense, utilitarian, Zillow-faithful.
function FootCol({
  title,
  links
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--text-primary)",
      marginBottom: 10
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      textDecoration: "none"
    }
  }, l)))));
}
function AZFooter() {
  const popular = ["Austin homes for sale", "Seattle apartments for rent", "Miami real estate", "Denver new construction", "Portland homes for sale", "Nashville apartments", "Phoenix real estate", "Chicago condos", "Boston homes for sale", "Atlanta apartments", "San Diego real estate", "Dallas new construction"];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "#fff",
      borderTop: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "32px 24px",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 16,
      color: "var(--text-primary)"
    }
  }, "Popular searches"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "10px 24px"
    }
  }, popular.map(p => /*#__PURE__*/React.createElement("a", {
    key: p,
    href: "#",
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      textDecoration: "none"
    }
  }, p)))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "32px 24px",
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr) 1.4fr",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(FootCol, {
    title: "About",
    links: ["About us", "Research", "Careers", "Investors", "Mobile apps"]
  }), /*#__PURE__*/React.createElement(FootCol, {
    title: "Discover",
    links: ["AgenticZillow blog", "Affordability", "Find an agent", "Home loans", "Rent guide"]
  }), /*#__PURE__*/React.createElement(FootCol, {
    title: "Real estate",
    links: ["Buy a home", "Sell a home", "New construction", "Foreclosures", "Open houses"]
  }), /*#__PURE__*/React.createElement(FootCol, {
    title: "Rentals",
    links: ["Apartments for rent", "Houses for rent", "Manage rentals", "List a rental", "Renter hub"]
  }), /*#__PURE__*/React.createElement(FootCol, {
    title: "Help",
    links: ["Help center", "Advertise", "Fair Housing", "Privacy", "Terms", "Do Not Sell"]
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "24",
    height: "24",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: "var(--blue-600)",
      letterSpacing: "-0.02em"
    }
  }, "AgenticZillow")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      margin: 0,
      lineHeight: "20px"
    }
  }, "Find it. Tour it. Own it \u2014 with a little help from your agents."))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-band)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 26,
      height: 26,
      border: "1.5px solid var(--text-muted)",
      borderRadius: 3,
      fontSize: 9,
      fontWeight: 700,
      color: "var(--text-muted)"
    }
  }, "EHO"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      margin: 0,
      flex: 1,
      minWidth: 280,
      lineHeight: "16px"
    }
  }, "\xA9 2026 AgenticZillow. Equal Housing Opportunity. ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, "AgenticZillow is a portfolio/demo clone for showcase purposes \u2014 not affiliated with Zillow Group. Listings and data are synthetic.")))));
}
window.AZFooter = AZFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// AgenticZillow website header — sticky, white, 3-zone nav with centered logo.
const {
  AskPill
} = window.AgenticZillowDesignSystem_f8327a;
function NavLink({
  children
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 500,
      color: h ? "var(--blue-600)" : "var(--text-primary)",
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: "8px 4px"
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      opacity: 0.6
    }
  }, "\u25BE"));
}
function AZHeader({
  scrolled
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 1000,
      background: "#fff",
      borderBottom: "1px solid var(--border-hairline)",
      boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      height: 60,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 24px",
      width: "100%",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      justifySelf: "start"
    }
  }, /*#__PURE__*/React.createElement(NavLink, null, "Buy"), /*#__PURE__*/React.createElement(NavLink, null, "Rent"), /*#__PURE__*/React.createElement(NavLink, null, "Sell"), /*#__PURE__*/React.createElement(NavLink, null, "Home Loans"), /*#__PURE__*/React.createElement(NavLink, null, "Find an Agent")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "AgenticZillow home",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      justifySelf: "center",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "28",
    height: "28",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: "var(--blue-600)",
      letterSpacing: "-0.02em"
    }
  }, "AgenticZillow")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      justifySelf: "end"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--text-primary)",
      textDecoration: "none"
    }
  }, "Manage Rentals"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--text-primary)",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z"
  })), "Saved"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--text-primary)",
      textDecoration: "none"
    }
  }, "Sign In"), /*#__PURE__*/React.createElement(AskPill, null))));
}
window.AZHeader = AZHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// AgenticZillow home / landing screen.
const {
  Button,
  PropertyCard,
  AskPill
} = window.AgenticZillowDesignSystem_f8327a;
const HERO_BG = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80";
const LISTINGS = [{
  photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  status: "for-sale",
  price: "$625,000",
  beds: 4,
  baths: 3,
  sqft: "2,150",
  homeType: "House",
  address: "1234 Pearl St, Austin, TX 78701",
  photoCount: "1/24",
  attribution: "Listing by Lone Star Realty"
}, {
  photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  status: "new",
  price: "$489,000",
  beds: 3,
  baths: 2,
  sqft: "1,640",
  homeType: "House",
  address: "88 Maple Ave, Austin, TX 78704",
  photoCount: "1/31",
  attribution: "Listing by Hill Country Homes"
}, {
  photo: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80",
  status: "tour",
  price: "$742,500",
  beds: 4,
  baths: 3,
  sqft: "2,480",
  homeType: "House",
  address: "5601 Bluebonnet Ln, Austin, TX 78745",
  photoCount: "1/18",
  attribution: "Listing by Capital Realty",
  priceCut: "$15,000 (May 2)"
}, {
  photo: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80",
  status: "pending",
  price: "$398,000",
  beds: 2,
  baths: 2,
  sqft: "1,180",
  homeType: "Condo",
  address: "201 Lavaca St #1408, Austin, TX 78701",
  photoCount: "1/27",
  attribution: "Listing by Urban Living Co."
}];
function Tile({
  img,
  title,
  body,
  cta
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: 12,
      padding: 28,
      textAlign: "center",
      boxShadow: h ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: h ? "translateY(-3px)" : "none",
      transition: "box-shadow .18s, transform .18s",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: "var(--blue-50)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 44
    }
  }, img)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: "var(--text-secondary)",
      lineHeight: "20px"
    }
  }, body), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    style: {
      marginTop: 4
    }
  }, cta));
}
function ProactiveStrip() {
  const items = [{
    tag: "3 new matches",
    label: "near your saved search “Austin · 3+ bd”"
  }, {
    tag: "Price drop",
    label: "$15k off a home in your Dream homes collection"
  }, {
    tag: "Below Zestimate",
    label: "a new listing priced 3% under estimate"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "20px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".04em",
      color: "var(--text-muted)"
    }
  }, "\u2726 From your agent")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.tag,
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: 12,
      padding: 16,
      background: "#fff",
      boxShadow: "var(--shadow-xs)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--blue-600)"
    }
  }, it.tag)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px",
      fontSize: 13,
      color: "var(--text-secondary)",
      lineHeight: "18px"
    }
  }, it.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Shortlist"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Analyze"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "text"
  }, "Dismiss"))))));
}
function HomeScreen() {
  const [q, setQ] = React.useState("");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height: 520,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: HERO_BG,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      textAlign: "center",
      maxWidth: 720,
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#fff",
      fontSize: 46,
      lineHeight: "52px",
      fontWeight: 700,
      margin: 0,
      letterSpacing: "-0.02em",
      textShadow: "0 2px 16px rgba(0,0,0,0.3)"
    }
  }, "Agents. Tours. Loans. Homes."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#fff",
      fontSize: 17,
      margin: "12px 0 28px",
      opacity: 0.95
    }
  }, "Find it. Tour it. Own it \u2014 with a little help."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      background: "#fff",
      borderRadius: 9999,
      boxShadow: "var(--shadow-lg)",
      padding: "6px 6px 6px 22px",
      maxWidth: 640,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Enter an address, neighborhood, city, or ZIP code",
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: 16,
      fontFamily: "var(--font-sans)",
      color: "var(--text-primary)",
      background: "transparent"
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Search",
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      border: "none",
      background: "var(--blue-600)",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.5-3.5"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      marginTop: 16
    }
  }, ["🏡 Find me a home", "💰 What can I afford?", "🖼️ Search by photo"].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#fff",
      background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.4)",
      borderRadius: 9999,
      padding: "7px 14px",
      backdropFilter: "blur(4px)",
      cursor: "pointer"
    }
  }, c))))), /*#__PURE__*/React.createElement(ProactiveStrip, null), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "24px 24px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Tile, {
    img: "\uD83D\uDD0D",
    title: "Buy a home",
    body: "Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.",
    cta: "Browse homes"
  }), /*#__PURE__*/React.createElement(Tile, {
    img: "\uD83D\uDD11",
    title: "Sell a home",
    body: "No matter what path you take to sell your home, we can help you navigate a successful sale.",
    cta: "See your options"
  }), /*#__PURE__*/React.createElement(Tile, {
    img: "\uD83C\uDFD8\uFE0F",
    title: "Rent a home",
    body: "We're creating a seamless online experience \u2014 from shopping to applying to paying rent.",
    cta: "Find rentals"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "32px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "Homes for you"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--blue-600)"
    }
  }, "See all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20
    }
  }, LISTINGS.map((l, i) => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: i
  }, l))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--blue-50)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "56px 24px",
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 12px",
      fontSize: 28,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "How much is your home worth?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 20px",
      fontSize: 16,
      color: "var(--text-secondary)",
      lineHeight: "24px"
    }
  }, "Get an instant AI-powered estimate, then let the Pricing agent walk you through the comps behind it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Enter your home address",
    style: {
      flex: 1,
      height: 44,
      borderRadius: 8,
      border: "1px solid var(--border-default)",
      padding: "0 14px",
      fontSize: 14,
      fontFamily: "var(--font-sans)",
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement(Button, null, "Get estimate"))), /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "",
    style: {
      width: "100%",
      height: 280,
      objectFit: "cover",
      borderRadius: 12,
      boxShadow: "var(--shadow-md)"
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--blue-600)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "48px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 20px",
      fontSize: 28,
      fontWeight: 700,
      color: "#fff"
    }
  }, "Ready to find your next home?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      height: 48,
      padding: "0 28px",
      borderRadius: 9999,
      border: "none",
      background: "#fff",
      color: "var(--blue-600)",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "Start your search"), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 48,
      padding: "0 28px",
      borderRadius: 9999,
      border: "1.5px solid rgba(255,255,255,0.7)",
      background: "transparent",
      color: "#fff",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      display: "inline-flex",
      alignItems: "center",
      gap: 7
    }
  }, "\u2726 Talk to AgenticZillow")))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SearchScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// AgenticZillow search results — sticky filter bar + map/list split.
const {
  Button,
  FilterPill,
  Select,
  PropertyCard,
  PriceBubble
} = window.AgenticZillowDesignSystem_f8327a;
const RESULTS = [{
  photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  status: "for-sale",
  price: "$625,000",
  beds: 4,
  baths: 3,
  sqft: "2,150",
  homeType: "House",
  address: "1234 Pearl St, Austin, TX 78701",
  photoCount: "1/24",
  attribution: "Lone Star Realty",
  _pin: "$625K",
  _x: 24,
  _y: 30
}, {
  photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  status: "new",
  price: "$489,000",
  beds: 3,
  baths: 2,
  sqft: "1,640",
  homeType: "House",
  address: "88 Maple Ave, Austin, TX 78704",
  photoCount: "1/31",
  attribution: "Hill Country Homes",
  _pin: "$489K",
  _x: 52,
  _y: 48,
  _state: "viewed"
}, {
  photo: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80",
  status: "tour",
  price: "$742,500",
  beds: 4,
  baths: 3,
  sqft: "2,480",
  homeType: "House",
  address: "5601 Bluebonnet Ln, Austin, TX 78745",
  photoCount: "1/18",
  attribution: "Capital Realty",
  priceCut: "$15,000 (May 2)",
  _pin: "$742K",
  _x: 38,
  _y: 64
}, {
  photo: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80",
  status: "pending",
  price: "$398,000",
  beds: 2,
  baths: 2,
  sqft: "1,180",
  homeType: "Condo",
  address: "201 Lavaca St #1408, Austin, TX 78701",
  photoCount: "1/27",
  attribution: "Urban Living Co.",
  _pin: "$398K",
  _x: 68,
  _y: 26,
  _state: "saved"
}, {
  photo: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80",
  status: "for-sale",
  price: "$555,000",
  beds: 3,
  baths: 2,
  sqft: "1,920",
  homeType: "House",
  address: "4410 Avenue G, Austin, TX 78751",
  photoCount: "1/22",
  attribution: "Bramlett Residential",
  _pin: "$555K",
  _x: 16,
  _y: 58
}, {
  photo: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
  status: "for-sale",
  price: "$689,000",
  beds: 4,
  baths: 3,
  sqft: "2,310",
  homeType: "House",
  address: "907 W 9th St, Austin, TX 78703",
  photoCount: "1/40",
  attribution: "Moreland Properties",
  _pin: "$689K",
  _x: 80,
  _y: 56,
  _state: "shortlisted"
}];
function MapPane() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%",
      background: "#EAEFF2",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,#F4F4F6,#EDEFF2)"
    }
  }), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    },
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-10,120 C200,90 320,200 520,160 S800,120 920,180",
    stroke: "#DCE6EF",
    strokeWidth: "34",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120,-20 C160,160 90,320 200,520",
    stroke: "#DCE6EF",
    strokeWidth: "22",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,300 H960",
    stroke: "#E2E2E6",
    strokeWidth: "2",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M400,0 V600",
    stroke: "#E2E2E6",
    strokeWidth: "2",
    fill: "none"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "#fff",
      borderRadius: 8,
      padding: "8px 12px",
      boxShadow: "var(--shadow-sm)",
      fontSize: 13,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 18,
      borderRadius: 9999,
      background: "var(--blue-600)",
      position: "relative",
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "#fff"
    }
  })), "Search as I move the map"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      display: "flex",
      gap: 6
    }
  }, ["Schools", "Transit", "Climate"].map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      background: "#fff",
      borderRadius: 9999,
      padding: "6px 12px",
      fontSize: 12,
      fontWeight: 600,
      boxShadow: "var(--shadow-xs)",
      cursor: "pointer"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      bottom: 12,
      background: "#fff",
      borderRadius: 8,
      padding: "8px 12px",
      boxShadow: "var(--shadow-sm)",
      fontSize: 13,
      fontWeight: 600,
      display: "inline-flex",
      gap: 6,
      cursor: "pointer"
    }
  }, "\u270E Draw"), RESULTS.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: r._x + "%",
      top: r._y + "%",
      transform: "translate(-50%,-100%)"
    }
  }, /*#__PURE__*/React.createElement(PriceBubble, {
    price: r._pin,
    state: r._state
  }))));
}
function SearchScreen() {
  const [sort, setSort] = React.useState("Homes for You");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 60px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "1px solid var(--border-hairline)",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "1px solid var(--border-default)",
      borderRadius: 8,
      padding: "0 12px",
      height: 40,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.5-3.5"
  })), /*#__PURE__*/React.createElement("input", {
    defaultValue: "Austin, TX",
    style: {
      border: "none",
      outline: "none",
      fontSize: 14,
      fontFamily: "var(--font-sans)",
      width: 120
    }
  })), /*#__PURE__*/React.createElement(FilterPill, {
    label: "For Sale"
  }), /*#__PURE__*/React.createElement(FilterPill, {
    label: "Price"
  }), /*#__PURE__*/React.createElement(FilterPill, {
    label: "Beds & Baths"
  }), /*#__PURE__*/React.createElement(FilterPill, {
    label: "Home Type",
    applied: true,
    count: 2
  }), /*#__PURE__*/React.createElement(FilterPill, {
    label: "More"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary"
  }, "Save search"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "agentic",
    pill: true,
    style: {
      height: 36
    },
    iconLeft: /*#__PURE__*/React.createElement("span", null, "\u2726")
  }, "Ask AI")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: "58% 42%",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(MapPane, null), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      borderLeft: "1px solid var(--border-hairline)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 4px",
      fontSize: 22,
      fontWeight: 700
    }
  }, "Austin, TX Real Estate & Homes for Sale"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "1,284 results"), /*#__PURE__*/React.createElement(Select, {
    value: sort,
    onChange: setSort,
    options: ["Homes for You", "Price (High to Low)", "Newest", "AI: Best match for me", "AI: Best deal"]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, ["Houses ✕", "Condos ✕", "Applied by AI: ≤ 30-min commute ✕"].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--blue-600)",
      background: "var(--blue-100)",
      borderRadius: 9999,
      padding: "5px 11px",
      cursor: "pointer"
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, RESULTS.map((r, i) => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: i
  }, r)))))));
}
window.SearchScreen = SearchScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SearchScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AgentTimelineRow = __ds_scope.AgentTimelineRow;

__ds_ns.AskPill = __ds_scope.AskPill;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatusTag = __ds_scope.StatusTag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.FilterPill = __ds_scope.FilterPill;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.PriceBubble = __ds_scope.PriceBubble;

__ds_ns.PropertyCard = __ds_scope.PropertyCard;

})();
