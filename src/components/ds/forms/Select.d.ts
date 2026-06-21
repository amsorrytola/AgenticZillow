import * as React from "react";

/** Select trigger + shadow menu (Sort, dropdowns). Trailing chevron, blue focus ring. */
export interface SelectOption { value: string; label: string; }
export interface SelectProps {
  value?: string;
  options: (SelectOption | string)[];
  placeholder?: string;
  onChange?: (value: string) => void;
  size?: "md" | "lg";
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
