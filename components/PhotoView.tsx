"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import type { Photo, SiteContentData } from "@/lib/types";

export function PhotoView({
  content,
  photo,
  prevId,
  nextId,
  index,
  total,
}: {
  content: SiteContentData;
  photo: Photo;
  prevId: string | null;
  nextId: string | null;
  index: number;
  total: number;
}) {
  const { t } = useLanguage();

  return (
    <>
      <SiteNav brand={content.brand} />

      <section className="wrap" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
        <Link href="/exhibition" className="link-underline mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>
          {t("Back to the exhibition", "Volver a la exposición")}
        </Link>

        <div style={{ marginTop: "var(--space-6)", background: "var(--surface)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.imageUrl} alt={t(photo.titleEn, photo.titleEs)} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "var(--space-4)" }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div style={{ display: "flex", gap: "var(--space-4)" }} className="mono">
            <PhotoNavLink id={prevId} label={t("Previous", "Anterior")} />
            <PhotoNavLink id={nextId} label={t("Next", "Siguiente")} />
          </div>
        </div>

        <div style={{ maxWidth: "var(--reading-max)", marginTop: "var(--space-8)" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "var(--space-4)" }}>{t(photo.titleEn, photo.titleEs)}</h1>
          <p className="serif" style={{ fontSize: 19, lineHeight: 1.75, color: "var(--ink-muted)" }}>
            {t(photo.descEn, photo.descEs)}
          </p>
        </div>
      </section>

      <SiteFooter creditEn={content.footerCreditEn} creditEs={content.footerCreditEs} />
    </>
  );
}

function PhotoNavLink({ id, label }: { id: string | null; label: string }) {
  if (!id) {
    return (
      <span style={{ fontSize: 12, opacity: 0.3 }}>{label}</span>
    );
  }
  return (
    <Link href={`/exhibition/${id}`} className="link-underline" style={{ fontSize: 12 }}>
      {label}
    </Link>
  );
}
