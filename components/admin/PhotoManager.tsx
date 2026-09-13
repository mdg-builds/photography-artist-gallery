"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/types";
import { savePhoto, deletePhoto, reorderPhoto, type PhotoFormState } from "@/app/admin/photos/actions";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload-limits";
import { tryDirectUpload } from "@/lib/client-upload";

export function PhotoManager({ photos }: { photos: Photo[] }) {
  const [editing, setEditing] = useState<Photo | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState<PhotoFormState, FormData>(savePhoto, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      setEditing(null);
      setPreview(null);
      setFileError(null);
      setDirectUrl(null);
      formRef.current?.reset();
    }
  }, [state]);

  function startEdit(photo: Photo) {
    setEditing(photo);
    setPreview(photo.imageUrl);
    setFileError(null);
    setDirectUrl(null);
  }

  function cancelEdit() {
    setEditing(null);
    setPreview(null);
    setFileError(null);
    setDirectUrl(null);
    formRef.current?.reset();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
      <section>
        <h2 style={{ fontSize: 20, marginBottom: "var(--space-4)" }}>
          {editing ? "Edit photograph" : "Add a photograph"}
        </h2>
        <form
          ref={formRef}
          action={formAction}
          key={editing?.id ?? "new"}
          style={{ border: "1px solid var(--divider)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
            <div className="field">
              <label htmlFor="titleEn">Title (English)</label>
              <input id="titleEn" name="titleEn" className="input" defaultValue={editing?.titleEn} required />
            </div>
            <div className="field">
              <label htmlFor="titleEs">Título (español)</label>
              <input id="titleEs" name="titleEs" className="input" defaultValue={editing?.titleEs} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
            <div className="field">
              <label htmlFor="descEn">Description (English)</label>
              <textarea id="descEn" name="descEn" className="input" rows={5} defaultValue={editing?.descEn} />
            </div>
            <div className="field">
              <label htmlFor="descEs">Descripción (español)</label>
              <textarea id="descEs" name="descEs" className="input" rows={5} defaultValue={editing?.descEs} />
            </div>
          </div>

          <input type="hidden" name="imageUrl" value={directUrl ?? ""} />

          <div className="field">
            <label htmlFor="image">Photograph {editing ? "(leave empty to keep the current image)" : ""}</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="input"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > MAX_UPLOAD_BYTES) {
                  setFileError(`That photo is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please use one under ${MAX_UPLOAD_MB}MB.`);
                  e.target.value = "";
                  return;
                }
                setFileError(null);
                setDirectUrl(null);
                setPreview(URL.createObjectURL(file));
                setUploading(true);
                const url = await tryDirectUpload(file, "photos");
                setUploading(false);
                setDirectUrl(url);
              }}
            />
          </div>

          {fileError && (
            <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>{fileError}</p>
          )}

          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" style={{ width: 200, height: 150, objectFit: "cover", background: "var(--surface)" }} />
          )}

          {state && "error" in state && (
            <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>{state.error}</p>
          )}

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button type="submit" className="btn btn-solid" disabled={pending || uploading}>
              {uploading ? "Uploading photo…" : pending ? "Saving…" : editing ? "Save changes" : "Add photograph"}
            </button>
            {editing && (
              <button type="button" className="btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: "var(--space-4)" }}>
          Photographs in the exhibition ({photos.length})
        </h2>
        {photos.length === 0 ? (
          <p style={{ color: "var(--ink-muted)" }}>No photographs added yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", borderBottom: "1px solid var(--divider)", paddingBottom: "var(--space-3)" }}
              >
                <div style={{ width: 84, height: 63, flex: "none", overflow: "hidden", background: "var(--surface)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{photo.titleEn}</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>{photo.titleEs}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <form action={reorderPhoto.bind(null, photo.id, "up")}>
                    <button type="submit" className="btn btn-sm" disabled={i === 0} title="Move up">↑</button>
                  </form>
                  <form action={reorderPhoto.bind(null, photo.id, "down")}>
                    <button type="submit" className="btn btn-sm" disabled={i === photos.length - 1} title="Move down">↓</button>
                  </form>
                </div>
                <button type="button" className="btn btn-sm" onClick={() => startEdit(photo)}>Edit</button>
                <form
                  action={deletePhoto.bind(null, photo.id)}
                  onSubmit={(e) => {
                    if (!confirm(`Delete "${photo.titleEn}"? This cannot be undone.`)) e.preventDefault();
                  }}
                >
                  <button type="submit" className="btn btn-sm">Delete</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @media (max-width: 640px) { .admin-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
