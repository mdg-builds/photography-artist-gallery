import type { MetadataRoute } from "next";
import { getPhotos } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const photos = await getPhotos();

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/exhibition`, priority: 0.9 },
    { url: `${base}/about`, priority: 0.7 },
    ...photos.map((p) => ({
      url: `${base}/exhibition/${p.id}`,
      lastModified: p.updatedAt,
      priority: 0.6,
    })),
  ];
}
