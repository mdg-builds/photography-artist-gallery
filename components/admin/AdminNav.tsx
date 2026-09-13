"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth-actions";

const TABS = [
  { href: "/admin/photos", label: "Photographs" },
  { href: "/admin/content", label: "Home & statement" },
  { href: "/admin/bios", label: "About / bios" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header style={{ borderBottom: "1px solid var(--divider)", background: "var(--paper)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", height: 64, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 800, fontSize: 15, marginRight: "var(--space-2)" }}>Sin Pedir Permiso</span>
        <nav style={{ display: "flex", gap: "var(--space-5)", marginRight: "auto", flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="link-underline"
              style={{ fontSize: 14, opacity: pathname?.startsWith(tab.href) ? 1 : 0.65 }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>{email}</span>
        <form action={logout}>
          <button type="submit" className="btn btn-sm">Sign out</button>
        </form>
      </div>
    </header>
  );
}
