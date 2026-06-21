import * as React from "react";

/** Transient notification card — leading status dot, message, optional action link. */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "success" | "error" | "info" | "neutral";
  icon?: React.ReactNode;
  /** Action link label (e.g. "Undo", "View"). */
  action?: React.ReactNode;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function Toast(props: ToastProps): JSX.Element;
