"use client";

import { useLanguage } from "./LanguageProvider";

export function SiteFooter({ creditEn, creditEs }: { creditEn: string; creditEs: string }) {
  const { t } = useLanguage();
  return (
    <footer style={{ background: "var(--deep-ink)", color: "var(--paper-on-ink)" }}>
      <div className="wrap" style={{ paddingBlock: "var(--space-6)" }}>
        <span className="serif" style={{ fontSize: 14, color: "var(--ink-muted-on-ink)" }}>
          {t(creditEn, creditEs)}
        </span>
      </div>
    </footer>
  );
}
