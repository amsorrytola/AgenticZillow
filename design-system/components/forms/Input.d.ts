import * as React from "react";

/**
 * Text input with optional leading icon, clear button and error state.
 * 40–44px tall, Zillow-blue focus ring.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  iconLeft?: React.ReactNode;
  /** Show an ✕ clear button when there is a value. */
  clearable?: boolean;
  onClear?: () => void;
  error?: boolean;
  size?: "md" | "lg";
  /** Style override for the outer wrapper. */
  wrapStyle?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
