import { ContentForm } from "@/components/admin/ContentForm";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getSiteContent();
  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: "var(--space-6)" }}>Home &amp; statement</h1>
      <ContentForm content={content} />
    </div>
  );
}
