"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <div style={{ width: "min(380px, 100%)", padding: "var(--space-4)" }}>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 6 }}>
          Sin Pedir Permiso
        </div>
        <h1 style={{ fontSize: 28 }}>Owner sign in</h1>
      </div>

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="field">
          <label htmlFor="email">Username</label>
          <input id="email" name="email" className="input" autoComplete="username" required autoFocus />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
        </div>

        {state?.error && (
          <p role="alert" style={{ color: "var(--signal-active)", fontSize: 14 }}>
            {state.error}
          </p>
        )}

        <button type="submit" className="btn btn-solid btn-block" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
