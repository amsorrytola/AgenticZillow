"use client";

import { useState } from "react";

export function ListingGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [main, setMain] = useState(0);
  const thumbs = photos.slice(0, 5);
  return (
    <div>
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "16 / 9", background: "var(--surface-band)" }}>
        <img src={photos[main]} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <span style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 9999, padding: "4px 10px" }}>{main + 1} / {photos.length}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${thumbs.length}, 1fr)`, gap: 8, marginTop: 8 }}>
        {thumbs.map((p, i) => (
          <button key={i} onClick={() => setMain(i)} style={{ border: i === main ? "2px solid var(--blue-600)" : "1px solid var(--border-hairline)", borderRadius: 8, overflow: "hidden", padding: 0, cursor: "pointer", aspectRatio: "4 / 3", background: "var(--surface-band)" }}>
            <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
