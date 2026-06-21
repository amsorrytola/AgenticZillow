import * as React from "react";

/**
 * Icon-only control (save / share / close). 40×40 with a light-gray hover circle.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  /** Active/selected — turns the icon Zillow blue. */
  active?: boolean;
  /** Accessible label (required for icon-only buttons). */
  label: string;
  children?: React.ReactNode;
}

export function IconButton(props: IconButtonProps): JSX.Element;
