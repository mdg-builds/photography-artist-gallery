import { BioManager } from "@/components/admin/BioManager";
import { getBios } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const bios = await getBios();
  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: "var(--space-6)" }}>About / bios</h1>
      <BioManager bios={bios} />
    </div>
  );
}
