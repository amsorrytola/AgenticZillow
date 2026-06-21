import * as React from "react";

/**
 * Property-card status tag — white pill, colored dot + label. Status is shown by
 * both dot color and text, never color alone (a11y).
 */
export interface StatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "for-sale" | "for-rent" | "pending" | "contingent" | "coming-soon" | "new" | "sold" | "tour" | "open-house";
  /** Override the default label for the status. */
  label?: string;
}

export function StatusTag(props: StatusTagProps): JSX.Element;
