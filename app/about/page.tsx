import { AboutView } from "@/components/AboutView";
import { getSiteContent, getBios } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [content, bios] = await Promise.all([getSiteContent(), getBios()]);
  return <AboutView content={content} bios={bios} />;
}
