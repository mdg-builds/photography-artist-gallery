"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
        <div className="mono" style={{ fontSize: 13, color: "var(--signal)", marginBottom: "var(--space-3)" }}>Error</div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", marginBottom: "var(--space-4)" }}>Something went wrong</h1>
        <p className="serif" style={{ fontSize: 18, color: "var(--ink-muted)", maxWidth: 480, marginBottom: "var(--space-8)" }}>
          The page couldn't load. Try again, or head back to the home page.
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <button type="button" className="btn btn-solid" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="btn">
            Home page
          </Link>
        </div>
      </div>
    </div>
  );
}
