"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import type { Photo, SiteContentData } from "@/lib/types";

export function HomeView({ content, photos }: { content: SiteContentData; photos: Photo[] }) {
  const { t } = useLanguage();
  const heroImage = content.heroImageUrl || photos[0]?.imageUrl;
  const statement = t(content.statementEn, content.statementEs)
    .split("\n\n")
    .filter(Boolean);
  const previewPhotos = photos.slice(0, 6);

  return (
    <>
      <SiteNav brand={content.brand} overHero />

      <section style={{ position: "relative", height: "94vh", minHeight: 560, background: "var(--deep-ink)" }}>
        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 }}
          />
        )}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, rgba(19,17,16,0.88) 0%, rgba(19,17,16,0.15) 46%, rgba(19,17,16,0.05) 100%)",
          }}
        />
        <div
          className="wrap"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: "var(--space-12)",
            color: "var(--paper-on-ink)",
          }}
        >
          <div className="mono" style={{ fontSize: 13, marginBottom: "var(--space-3)", opacity: 0.75 }}>
            {t("North Carolina, 2016–2026", "Carolina del Norte, 2016–2026")}
          </div>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 96px)", maxWidth: 920 }}>{content.brand}</h1>
          {t(content.heroSubtitleEn, content.heroSubtitleEs) && (
            <p className="serif" style={{ fontSize: "clamp(18px, 2.4vw, 26px)", fontStyle: "italic", marginTop: "var(--space-3)", maxWidth: 620, opacity: 0.92 }}>
              {t(content.heroSubtitleEn, content.heroSubtitleEs)}
            </p>
          )}
          <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-8)", flexWrap: "wrap" }}>
            <Link href="/exhibition" className="btn btn-signal">
              {t("View the exhibition", "Ver la exposición")}
            </Link>
            <Link
              href="/about"
              className="btn"
              style={{ borderColor: "rgba(243,242,242,0.4)", color: "var(--paper-on-ink)" }}
            >
              {t("Meet the artists", "Sobre los artistas")}
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap statement-row" style={{ paddingBlock: "var(--space-20)" }}>
        <div style={{ maxWidth: "var(--reading-max)" }}>
          {statement.map((para, i) => (
            <p key={i} className="serif" style={{ fontSize: 19, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
              {para}
            </p>
          ))}
          {(content.heroCreditEn || content.heroCreditEs) && (
            <p className="mono" style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: "var(--space-6)" }}>
              {t(content.heroCreditEn, content.heroCreditEs)}
            </p>
          )}
        </div>
        <div className="statement-margin" aria-hidden style={{ borderLeft: "1px solid var(--signal)", paddingLeft: "var(--space-6)" }}>
          <p className="serif" style={{ fontSize: 40, fontStyle: "italic", lineHeight: 1.25, color: "var(--ink-faint)" }}>
            sin pedir permiso.
          </p>
        </div>
      </section>

      {previewPhotos.length > 0 && (
        <section style={{ paddingBottom: "var(--space-20)" }}>
          <div className="wrap">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              {previewPhotos.map((p) => (
                <Link
                  key={p.id}
                  href={`/exhibition/${p.id}`}
                  style={{ display: "block", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--surface)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={t(p.titleEn, p.titleEs)}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Link>
              ))}
            </div>
            <div style={{ marginTop: "var(--space-8)" }}>
              <Link href="/exhibition" className="btn-ghost link-underline" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                {t("View all photographs", "Ver todas las fotografías")}
              </Link>
            </div>
          </div>
        </section>
      )}

      <SiteFooter creditEn={content.footerCreditEn} creditEs={content.footerCreditEs} />

      <style>{`
        .statement-row { display: flex; gap: var(--space-10); align-items: flex-start; }
        .statement-margin { display: none; flex: 1; padding-top: var(--space-2); }
        @media (min-width: 960px) {
          .statement-margin { display: block; }
        }
      `}</style>
    </>
  );
}
