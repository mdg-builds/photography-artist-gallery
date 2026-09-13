import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: "var(--space-6)" }}>Settings</h1>
      <SettingsForm email={session?.email ?? ""} />
    </div>
  );
}
