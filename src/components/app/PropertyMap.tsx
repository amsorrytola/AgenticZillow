"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/lib/domain/types";
import { fmtPriceShort } from "@/lib/format";

const STYLE = "https://tiles.openfreemap.org/styles/positron";

interface Props {
  listings: Listing[];
  center: { lat: number; lng: number };
  zoom: number;
  activeId?: string | null;
  savedIds?: string[];
  onActivate?: (id: string | null) => void;
}

export function PropertyMap({ listings, center, zoom, activeId, savedIds = [], onActivate }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const glRef = useRef<any>(null);

  // init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      glRef.current = maplibregl;
      const map = new maplibregl.Map({
        container: elRef.current,
        style: STYLE,
        center: [center.lng, center.lat],
        zoom,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recenter when metro changes
  useEffect(() => {
    mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom, essential: true });
  }, [center.lat, center.lng, zoom]);

  // sync markers
  useEffect(() => {
    const map = mapRef.current;
    const gl = glRef.current;
    if (!map || !gl) return;

    const render = () => {
      const seen = new Set<string>();
      for (const l of listings) {
        seen.add(l.id);
        let marker = markersRef.current.get(l.id);
        const isActive = l.id === activeId;
        const isSaved = savedIds.includes(l.id);
        const bg = isActive ? "var(--blue-600)" : "#fff";
        const fg = isActive ? "#fff" : "var(--blue-600)";
        const border = isSaved ? "var(--saved-heart)" : isActive ? "var(--blue-600)" : "var(--blue-600)";
        if (!marker) {
          const el = document.createElement("button");
          el.setAttribute("aria-label", `${l.address.line1}`);
          el.style.cssText =
            "font:700 12px var(--font-sans);padding:4px 8px;border-radius:9999px;cursor:pointer;box-shadow:var(--shadow-pin);white-space:nowrap;transition:transform .12s;";
          el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.08)"; el.style.zIndex = "5"; });
          el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
          el.addEventListener("click", (e) => { e.stopPropagation(); onActivate?.(l.id); });
          marker = new gl.Marker({ element: el }).setLngLat([l.lng, l.lat]).addTo(map);
          markersRef.current.set(l.id, marker);
        }
        const el = marker.getElement() as HTMLButtonElement;
        el.textContent = fmtPriceShort(l.price);
        el.style.background = bg;
        el.style.color = fg;
        el.style.border = `1.5px solid ${border}`;
      }
      // remove stale
      for (const [id, marker] of markersRef.current) {
        if (!seen.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }
    };

    if (map.loaded()) render();
    else map.once("load", render);
  }, [listings, activeId, savedIds, onActivate]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#EAEFF2" }}>
      <div ref={elRef} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 2 }}>
        {["Schools", "Transit", "Climate"].map((l) => (
          <span key={l} style={{ background: "#fff", borderRadius: 9999, padding: "6px 12px", fontSize: 12, fontWeight: 600, boxShadow: "var(--shadow-xs)", cursor: "pointer" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
