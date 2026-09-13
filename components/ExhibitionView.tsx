"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import type { Photo, SiteContentData } from "@/lib/types";

export function ExhibitionView({ content, photos }: { content: SiteContentData; photos: Photo[] }) {
  const { t } = useLanguage();

  return (
    <>
      <SiteNav brand={content.brand} />

      <section className="wrap" style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-8)" }}>
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: "var(--space-2)" }}>
          {t(`${photos.length} photographs`, `${photos.length} fotografías`)}
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>{t("The Exhibition", "La Exposición")}</h1>
      </section>

      <div className="hr wrap" />

      <section className="wrap" style={{ paddingBlock: "var(--space-10)" }}>
        {photos.length === 0 ? (
          <div style={{ maxWidth: 480, padding: "var(--space-6) 0" }}>
            <p className="serif" style={{ fontSize: 18, color: "var(--ink-muted)" }}>
              {t("No photographs yet. Check back soon.", "Aún no hay fotografías. Vuelve pronto.")}
            </p>
          </div>
        ) : (
          <div
            style={{
              columnCount: 1,
              columnGap: "var(--space-5)",
            }}
            className="exhibition-masonry"
          >
            {photos.map((p, i) => (
              <Link
                key={p.id}
                href={`/exhibition/${p.id}`}
                style={{
                  display: "block",
                  breakInside: "avoid",
                  marginBottom: "var(--space-5)",
                  position: "relative",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden", background: "var(--surface)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={t(p.titleEn, p.titleEs)}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      fontSize: 11,
                      color: "#fff",
                      background: "rgba(19,17,16,0.55)",
                      padding: "2px 7px",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ paddingTop: "var(--space-2)" }}>
                  <span className="serif" style={{ fontSize: 16, fontStyle: "italic" }}>
                    {t(p.titleEn, p.titleEs)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter creditEn={content.footerCreditEn} creditEs={content.footerCreditEs} />

      <style>{`
        @media (min-width: 640px) {
          .exhibition-masonry { column-count: 2 !important; }
        }
        @media (min-width: 1020px) {
          .exhibition-masonry { column-count: 3 !important; }
        }
      `}</style>
    </>
  );
}
