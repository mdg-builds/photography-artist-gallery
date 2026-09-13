import { HomeView } from "@/components/HomeView";
import { getSiteContent, getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [content, photos] = await Promise.all([getSiteContent(), getPhotos()]);
  return <HomeView content={content} photos={photos} />;
}
