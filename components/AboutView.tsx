"use client";

import { useLanguage } from "./LanguageProvider";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import type { Bio, SiteContentData } from "@/lib/types";

export function AboutView({ content, bios }: { content: SiteContentData; bios: Bio[] }) {
  const { t } = useLanguage();

  return (
    <>
      <SiteNav brand={content.brand} />

      <section className="wrap" style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-10)" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>{t("About", "Acerca de")}</h1>
      </section>

      <div className="hr wrap" />

      <section className="wrap" style={{ paddingBlock: "var(--space-12)", display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
        {bios.map((bio) => (
          <div key={bio.id} className="bio-row">
            <div style={{ aspectRatio: "1 / 1", background: "var(--surface)", overflow: "hidden" }}>
              {bio.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bio.imageUrl} alt={bio.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : null}
            </div>
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 4 }}>{bio.name}</h2>
              <div className="mono" style={{ fontSize: 12, color: "var(--signal)", marginBottom: "var(--space-4)" }}>
                {t(bio.roleEn, bio.roleEs)}
              </div>
              <p className="serif" style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink-muted)" }}>
                {t(bio.bodyEn, bio.bodyEs)}
              </p>
            </div>
          </div>
        ))}
      </section>

      <SiteFooter creditEn={content.footerCreditEn} creditEs={content.footerCreditEs} />

      <style>{`
        .bio-row { display: grid; grid-template-columns: 220px 1fr; gap: var(--space-8); align-items: start; }
        @media (max-width: 620px) { .bio-row { grid-template-columns: 1fr; } .bio-row > div:first-child { max-width: 200px; } }
      `}</style>
    </>
  );
}
