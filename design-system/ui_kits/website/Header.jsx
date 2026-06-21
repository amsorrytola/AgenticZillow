// AgenticZillow website header — sticky, white, 3-zone nav with centered logo.
const { AskPill } = window.AgenticZillowDesignSystem_f8327a;

function NavLink({ children }) {
  const [h, setH] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        border: "none", background: "transparent", cursor: "pointer",
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        color: h ? "var(--blue-600)" : "var(--text-primary)",
        display: "inline-flex", alignItems: "center", gap: 3, padding: "8px 4px",
      }}
    >
      {children}
      <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
    </button>
  );
}

function AZHeader({ scrolled }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 1000, background: "#fff",
      borderBottom: "1px solid var(--border-hairline)",
      boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      height: 60, display: "flex", alignItems: "center",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%",
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16,
      }}>
        {/* left cluster */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, justifySelf: "start" }}>
          <NavLink>Buy</NavLink>
          <NavLink>Rent</NavLink>
          <NavLink>Sell</NavLink>
          <NavLink>Home Loans</NavLink>
          <NavLink>Find an Agent</NavLink>
        </nav>
        {/* center logo */}
        <a href="#" aria-label="AgenticZillow home" style={{
          display: "inline-flex", alignItems: "center", gap: 8, justifySelf: "center", textDecoration: "none",
        }}>
          <img src="../../assets/logo-mark.svg" width="28" height="28" alt="" />
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--blue-600)", letterSpacing: "-0.02em" }}>AgenticZillow</span>
        </a>
        {/* right cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifySelf: "end" }}>
          <a href="#" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", textDecoration: "none" }}>Manage Rentals</a>
          <a href="#" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20.5 4.4 13a4.6 4.6 0 0 1 6.5-6.5l1.1 1.1 1.1-1.1A4.6 4.6 0 0 1 19.6 13L12 20.5Z"/></svg>
            Saved
          </a>
          <a href="#" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", textDecoration: "none" }}>Sign In</a>
          <AskPill />
        </div>
      </div>
    </header>
  );
}
window.AZHeader = AZHeader;
