"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export function SiteNav({ brand, overHero = false }: { brand: string; overHero?: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    function onScroll() {
      setScrolled(window.scrollY > 64);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const solid = !overHero || scrolled || menuOpen;

  const links = [
    { href: "/exhibition", label: t("Exhibition", "Exposición") },
    { href: "/about", label: t("About", "Acerca de") },
  ];

  const langToggle = (
    <div className="mono" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
      <button
        type="button"
        onClick={() => setLang("en")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: lang === "en" ? 700 : 400, opacity: lang === "en" ? 1 : 0.55, padding: 0, fontFamily: "inherit", fontSize: "inherit" }}
        aria-current={lang === "en"}
      >
        EN
      </button>
      <span aria-hidden style={{ opacity: 0.4 }}>/</span>
      <button
        type="button"
        onClick={() => setLang("es")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: lang === "es" ? 700 : 400, opacity: lang === "es" ? 1 : 0.55, padding: 0, fontFamily: "inherit", fontSize: "inherit" }}
        aria-current={lang === "es"}
      >
        ES
      </button>
    </div>
  );

  return (
    <header
      style={{
        position: overHero ? "fixed" : "static",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: solid ? "var(--paper)" : "transparent",
        borderBottom: solid ? "1px solid var(--divider)" : "1px solid transparent",
        color: solid ? "var(--ink)" : "var(--paper-on-ink)",
        transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
      }}
    >
      <nav className="wrap nav-row" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", height: 68 }}>
        <Link
          href="/"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, marginRight: "auto", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
        >
          {brand}
        </Link>

        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline"
              style={{ fontSize: 14, opacity: pathname === l.href ? 1 : 0.85, whiteSpace: "nowrap" }}
            >
              {l.label}
            </Link>
          ))}
          {langToggle}
        </div>

        <button
          type="button"
          className="nav-menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("Close menu", "Cerrar menú") : t("Open menu", "Abrir menú")}
          style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 4, display: "none" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.6" />
            ) : (
              <path d="M3 6H19M3 11H19M3 16H19" stroke="currentColor" strokeWidth="1.6" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          className="nav-mobile-panel wrap"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingBlock: "var(--space-4)", borderTop: "1px solid var(--divider)" }}
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: 16 }}>
              {l.label}
            </Link>
          ))}
          {langToggle}
        </div>
      )}

      <style>{`
        .nav-menu-toggle { display: none; }
        @media (max-width: 640px) {
          .nav-links-desktop { display: none !important; }
          .nav-menu-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
