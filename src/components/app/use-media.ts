"use client";

import { useEffect, useState } from "react";

/** SSR-safe media query hook. Starts `false` (desktop) so server + first client
 * render match, then corrects on mount. */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
