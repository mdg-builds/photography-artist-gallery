import { getSession } from "@/lib/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--paper)", color: "var(--ink)" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)" }}>
      <AdminNav email={session.email} />
      <main className="wrap" style={{ paddingBlock: "var(--space-8)" }}>
        {children}
      </main>
    </div>
  );
}
