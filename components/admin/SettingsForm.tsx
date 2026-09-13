"use client";

import { useActionState, useRef, useEffect } from "react";
import { updateCredentials, type SettingsFormState } from "@/app/admin/settings/actions";

export function SettingsForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateCredentials, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 420 }}>
      <div className="field">
        <label>Current username</label>
        <input className="input" value={email} disabled />
      </div>
      <div className="field">
        <label htmlFor="currentPassword">Current password</label>
        <input id="currentPassword" name="currentPassword" type="password" className="input" autoComplete="current-password" required />
      </div>
      <div className="field">
        <label htmlFor="newEmail">New username (leave empty to keep the current one)</label>
        <input id="newEmail" name="newEmail" className="input" autoComplete="username" />
      </div>
      <div className="field">
        <label htmlFor="newPassword">New password (leave empty to keep the current one)</label>
        <input id="newPassword" name="newPassword" type="password" className="input" autoComplete="new-password" />
      </div>
      <div className="field">
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" className="input" autoComplete="new-password" />
      </div>

      {state && "error" in state && (
        <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>{state.error}</p>
      )}
      {state && "ok" in state && state.ok && (
        <p role="status" style={{ color: "var(--ink-muted)", fontSize: 14 }}>Updated.</p>
      )}

      <div>
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? "Saving…" : "Update"}
        </button>
      </div>
    </form>
  );
}
