"use client";

import { useActionState, useState } from "react";
import type { SiteContentData } from "@/lib/types";
import { saveSiteContent, type ContentFormState } from "@/app/admin/content/actions";

export function ContentForm({ content }: { content: SiteContentData }) {
  const [state, formAction, pending] = useActionState<ContentFormState, FormData>(saveSiteContent, undefined);
  const [preview, setPreview] = useState<string | null>(content.heroImageUrl ?? null);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: 760 }}>
      <section>
        <h2 style={{ fontSize: 18, marginBottom: "var(--space-3)" }}>Site name</h2>
        <div className="field">
          <label htmlFor="brand">Name shown in the navigation and title</label>
          <input id="brand" name="brand" className="input" defaultValue={content.brand} required />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: "var(--space-3)" }}>Home page hero</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="field">
            <label htmlFor="heroImage">Hero photograph {content.heroImageUrl ? "(leave empty to keep the current one)" : "(defaults to the first exhibition photograph if left empty)"}</label>
            <input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" style={{ width: 260, height: 150, objectFit: "cover", background: "var(--surface)" }} />
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
            <div className="field">
              <label htmlFor="heroSubtitleEn">Subtitle (English)</label>
              <input id="heroSubtitleEn" name="heroSubtitleEn" className="input" defaultValue={content.heroSubtitleEn} />
            </div>
            <div className="field">
              <label htmlFor="heroSubtitleEs">Subtítulo (español)</label>
              <input id="heroSubtitleEs" name="heroSubtitleEs" className="input" defaultValue={content.heroSubtitleEs} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
            <div className="field">
              <label htmlFor="heroCreditEn">Photo credit (English)</label>
              <input id="heroCreditEn" name="heroCreditEn" className="input" defaultValue={content.heroCreditEn} />
            </div>
            <div className="field">
              <label htmlFor="heroCreditEs">Crédito (español)</label>
              <input id="heroCreditEs" name="heroCreditEs" className="input" defaultValue={content.heroCreditEs} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: "var(--space-3)" }}>Project statement</h2>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: "var(--space-3)" }}>
          Separate paragraphs with a blank line.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
          <div className="field">
            <label htmlFor="statementEn">Statement (English)</label>
            <textarea id="statementEn" name="statementEn" className="input" rows={12} defaultValue={content.statementEn} />
          </div>
          <div className="field">
            <label htmlFor="statementEs">Descripción del proyecto (español)</label>
            <textarea id="statementEs" name="statementEs" className="input" rows={12} defaultValue={content.statementEs} />
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: "var(--space-3)" }}>Footer credit</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
          <div className="field">
            <label htmlFor="footerCreditEn">English</label>
            <input id="footerCreditEn" name="footerCreditEn" className="input" defaultValue={content.footerCreditEn} />
          </div>
          <div className="field">
            <label htmlFor="footerCreditEs">Español</label>
            <input id="footerCreditEs" name="footerCreditEs" className="input" defaultValue={content.footerCreditEs} />
          </div>
        </div>
      </section>

      {state && "error" in state && (
        <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>{state.error}</p>
      )}
      {state && "ok" in state && state.ok && (
        <p role="status" style={{ color: "var(--ink-muted)", fontSize: 14 }}>Saved.</p>
      )}

      <div>
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) { .admin-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </form>
  );
}
