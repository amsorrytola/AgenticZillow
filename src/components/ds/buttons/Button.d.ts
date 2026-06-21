import * as React from "react";

/**
 * The brand's primary action control — Zillow-blue fill primary, with
 * outline, ghost, text, destructive, and the one branded "agentic" variant.
 *
 * @startingPoint section="Core" subtitle="Primary, secondary, ghost & agentic buttons" viewport="700x140"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Use `agentic` only for the single branded AI entry point. */
  variant?: "primary" | "secondary" | "ghost" | "text" | "destructive" | "agentic";
  size?: "sm" | "md" | "lg";
  /** Full pill radius (hero CTAs). */
  pill?: boolean;
  disabled?: boolean;
  /** Stretch to container width. */
  block?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
