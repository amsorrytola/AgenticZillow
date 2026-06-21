"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface SavedApi {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}
const Ctx = createContext<SavedApi | null>(null);
const KEY = "az_saved_homes";

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const r = localStorage.getItem(KEY);
      if (r) setIds(JSON.parse(r));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return <Ctx.Provider value={{ ids, has, toggle }}>{children}</Ctx.Provider>;
}

export function useSaved(): SavedApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSaved must be used within SavedProvider");
  return c;
}
