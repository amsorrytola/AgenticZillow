import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>🏚️</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>This home wandered off the map</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>The page or listing you're looking for isn't here.</p>
      <Link href="/" style={{ display: "inline-flex", height: 44, padding: "0 24px", alignItems: "center", borderRadius: 8, background: "var(--blue-600)", color: "#fff", fontSize: 14, fontWeight: 600 }}>Back to home</Link>
    </div>
  );
}
