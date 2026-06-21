import * as React from "react";

/** Checkbox with a Zillow-blue fill when checked. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  label?: React.ReactNode;
  disabled?: boolean;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
