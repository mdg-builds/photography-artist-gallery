"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Bio } from "@/lib/types";
import { saveBio, deleteBio, reorderBio, type BioFormState } from "@/app/admin/bios/actions";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload-limits";
import { tryDirectUpload } from "@/lib/client-upload";

export function BioManager({ bios }: { bios: Bio[] }) {
  const [editing, setEditing] = useState<Bio | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState<BioFormState, FormData>(saveBio, undefined);
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

  function startEdit(bio: Bio) {
    setEditing(bio);
    setPreview(bio.imageUrl);
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
        <h2 style={{ fontSize: 20, marginBottom: "var(--space-4)" }}>{editing ? "Edit bio" : "Add a bio"}</h2>
        <form
          ref={formRef}
          action={formAction}
          key={editing?.id ?? "new"}
          style={{ border: "1px solid var(--divider)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 720 }}
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" className="input" defaultValue={editing?.name} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
            <div className="field">
              <label htmlFor="roleEn">Role (English)</label>
              <input id="roleEn" name="roleEn" className="input" defaultValue={editing?.roleEn} />
            </div>
            <div className="field">
              <label htmlFor="roleEs">Rol (español)</label>
              <input id="roleEs" name="roleEs" className="input" defaultValue={editing?.roleEs} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }} className="admin-grid">
            <div className="field">
              <label htmlFor="bodyEn">Bio (English)</label>
              <textarea id="bodyEn" name="bodyEn" className="input" rows={6} defaultValue={editing?.bodyEn} />
            </div>
            <div className="field">
              <label htmlFor="bodyEs">Biografía (español)</label>
              <textarea id="bodyEs" name="bodyEs" className="input" rows={6} defaultValue={editing?.bodyEs} />
            </div>
          </div>

          <input type="hidden" name="imageUrl" value={directUrl ?? ""} />

          <div className="field">
            <label htmlFor="image">Photo {editing ? "(leave empty to keep the current one)" : ""}</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="input"
              onChange={async (e) => {
                const input = e.target;
                const file = input.files?.[0];
                if (!file) return;
                if (file.size > MAX_UPLOAD_BYTES) {
                  setFileError(`That photo is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please use one under ${MAX_UPLOAD_MB}MB.`);
                  input.value = "";
                  return;
                }
                setFileError(null);
                setDirectUrl(null);
                setPreview(URL.createObjectURL(file));
                setUploading(true);
                const url = await tryDirectUpload(file, "bios");
                setUploading(false);
                setDirectUrl(url);
                if (url) input.value = "";
              }}
            />
          </div>

          {fileError && (
            <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>{fileError}</p>
          )}

          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" style={{ width: 140, height: 140, objectFit: "cover", background: "var(--surface)" }} />
          )}

          {state && "error" in state && (
            <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>{state.error}</p>
          )}

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button type="submit" className="btn btn-solid" disabled={pending || uploading}>
              {uploading ? "Uploading photo…" : pending ? "Saving…" : editing ? "Save changes" : "Add bio"}
            </button>
            {editing && (
              <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: "var(--space-4)" }}>People ({bios.length})</h2>
        {bios.length === 0 ? (
          <p style={{ color: "var(--ink-muted)" }}>No one added yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {bios.map((bio, i) => (
              <div key={bio.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", borderBottom: "1px solid var(--divider)", paddingBottom: "var(--space-3)" }}>
                <div style={{ width: 56, height: 56, flex: "none", overflow: "hidden", background: "var(--surface)", borderRadius: "50%" }}>
                  {bio.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bio.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{bio.name}</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>{bio.roleEn}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <form action={reorderBio.bind(null, bio.id, "up")}>
                    <button type="submit" className="btn btn-sm" disabled={i === 0} title="Move up">↑</button>
                  </form>
                  <form action={reorderBio.bind(null, bio.id, "down")}>
                    <button type="submit" className="btn btn-sm" disabled={i === bios.length - 1} title="Move down">↓</button>
                  </form>
                </div>
                <button type="button" className="btn btn-sm" onClick={() => startEdit(bio)}>Edit</button>
                <form
                  action={deleteBio.bind(null, bio.id)}
                  onSubmit={(e) => {
                    if (!confirm(`Remove "${bio.name}"?`)) e.preventDefault();
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
