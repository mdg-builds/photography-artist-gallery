import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--paper)", color: "var(--ink)" }}>
      <header style={{ borderBottom: "1px solid var(--divider)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", height: 68 }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>
            Sin Pedir Permiso
          </Link>
        </div>
      </header>
      <div className="wrap" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBlock: "var(--space-16)" }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: "var(--space-3)" }}>404</div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", marginBottom: "var(--space-4)" }}>Page not found</h1>
        <p className="serif" style={{ fontSize: 18, color: "var(--ink-muted)", maxWidth: 480, marginBottom: "var(--space-8)" }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div>
          <Link href="/" className="btn btn-solid">
            Back to the home page
          </Link>
        </div>
      </div>
    </div>
  );
}
