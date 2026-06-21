import Link from "next/link";

export function Logo({ size = 28, font = 22 }: { size?: number; font?: number }) {
  return (
    <Link href="/" aria-label="AgenticZillow home" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" role="img" aria-hidden>
        <path d="M19.04 4.66 4.3 16.74A3.5 3.5 0 0 0 3 19.45V32.5A3.5 3.5 0 0 0 6.5 36H14v-9.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V36h7.5a3.5 3.5 0 0 0 3.5-3.5V19.45a3.5 3.5 0 0 0-1.3-2.71L20.96 4.66a1.5 1.5 0 0 0-1.92 0Z" fill="#006AFF" />
      </svg>
      <span style={{ fontSize: font, fontWeight: 700, color: "var(--blue-600)", letterSpacing: "-0.02em" }}>AgenticZillow</span>
    </Link>
  );
}
