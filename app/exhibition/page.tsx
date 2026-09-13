import { ExhibitionView } from "@/components/ExhibitionView";
import { getSiteContent, getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [content, photos] = await Promise.all([getSiteContent(), getPhotos()]);
  return <ExhibitionView content={content} photos={photos} />;
}
