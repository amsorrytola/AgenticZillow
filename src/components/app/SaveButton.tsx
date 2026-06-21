"use client";

import { useSaved } from "./saved-store";

export function SaveButton({ id }: { id: string }) {
  const { has, toggle } = useSaved();
  const saved = has(id);
  return (
    <button
      onClick={() => toggle(id)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 16px",
        borderRadius: 8, border: "1px solid var(--border-default)", background: "#fff",
        color: saved ? "var(--saved-heart)" : "var(--text-primary)", fontSize: 14, fontWeight: 600, cursor: "pointer",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "var(--saved-heart)" : "none"} stroke={saved ? "var(--saved-heart)" : "currentColor"} strokeWidth="1.8"><path d="M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z" /></svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
