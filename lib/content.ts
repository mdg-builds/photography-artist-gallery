import { prisma } from "@/lib/db";

export type SiteContentData = Awaited<ReturnType<typeof getSiteContent>>;

const DEFAULT_SITE_CONTENT = {
  id: 1,
  brand: "Sin Pedir Permiso",
  heroSubtitleEn: "Without Asking Permission",
  heroSubtitleEs: "",
  heroCreditEn: "",
  heroCreditEs: "",
  heroImageUrl: null as string | null,
  statementEn: "",
  statementEs: "",
  footerCreditEn: "",
  footerCreditEs: "",
  updatedAt: new Date(),
};

export async function getSiteContent() {
  const row = await prisma.siteContent.findUnique({ where: { id: 1 } });
  return row ?? DEFAULT_SITE_CONTENT;
}

export async function getPhotos() {
  return prisma.photo.findMany({ orderBy: { order: "asc" } });
}

export async function getPhotoWithNeighbors(id: string) {
  const photos = await getPhotos();
  const index = photos.findIndex((p) => p.id === id);
  if (index === -1) return null;
  return {
    photo: photos[index],
    prevId: index > 0 ? photos[index - 1].id : null,
    nextId: index < photos.length - 1 ? photos[index + 1].id : null,
    index,
    total: photos.length,
  };
}

export async function getBios() {
  return prisma.bio.findMany({ orderBy: { order: "asc" } });
}
