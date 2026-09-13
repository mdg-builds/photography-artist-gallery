import { PhotoManager } from "@/components/admin/PhotoManager";
import { getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const photos = await getPhotos();
  return <PhotoManager photos={photos} />;
}
