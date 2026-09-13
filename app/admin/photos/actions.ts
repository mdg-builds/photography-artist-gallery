"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveImage, removeImage } from "@/lib/storage";

export type PhotoFormState = { ok: true } | { error: string } | undefined;

export async function savePhoto(_prev: PhotoFormState, formData: FormData): Promise<PhotoFormState> {
  const id = String(formData.get("id") || "") || null;
  const titleEn = String(formData.get("titleEn") || "").trim();
  const titleEs = String(formData.get("titleEs") || "").trim();
  const descEn = String(formData.get("descEn") || "").trim();
  const descEs = String(formData.get("descEs") || "").trim();
  const raw = formData.get("image");
  const imageFile = raw instanceof File && raw.size > 0 ? raw : null;

  if (!titleEn || !titleEs) return { error: "Title is required in both English and Spanish." };
  if (!id && !imageFile) return { error: "Choose a photograph to upload." };

  if (id) {
    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return { error: "That photograph no longer exists." };
    let imageUrl = existing.imageUrl;
    if (imageFile) {
      imageUrl = await saveImage(imageFile, "photos");
      await removeImage(existing.imageUrl);
    }
    await prisma.photo.update({ where: { id }, data: { titleEn, titleEs, descEn, descEs, imageUrl } });
    revalidatePath(`/exhibition/${id}`);
  } else {
    const imageUrl = await saveImage(imageFile!, "photos");
    const maxOrder = await prisma.photo.aggregate({ _max: { order: true } });
    await prisma.photo.create({
      data: { imageUrl, titleEn, titleEs, descEn, descEs, order: (maxOrder._max.order ?? -1) + 1 },
    });
  }

  revalidatePath("/admin/photos");
  revalidatePath("/");
  revalidatePath("/exhibition");
  return { ok: true };
}

export async function deletePhoto(id: string) {
  const existing = await prisma.photo.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.photo.delete({ where: { id } });
  await removeImage(existing.imageUrl);
  revalidatePath("/admin/photos");
  revalidatePath("/");
  revalidatePath("/exhibition");
}

export async function reorderPhoto(id: string, direction: "up" | "down") {
  const photos = await prisma.photo.findMany({ orderBy: { order: "asc" } });
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= photos.length) return;
  const a = photos[idx];
  const b = photos[swapWith];
  await prisma.$transaction([
    prisma.photo.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.photo.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/admin/photos");
  revalidatePath("/");
  revalidatePath("/exhibition");
}
