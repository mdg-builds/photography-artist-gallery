"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveImage, removeImage } from "@/lib/storage";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload-limits";

export type PhotoFormState = { ok: true } | { error: string } | undefined;

export async function savePhoto(_prev: PhotoFormState, formData: FormData): Promise<PhotoFormState> {
  const id = String(formData.get("id") || "") || null;
  const titleEn = String(formData.get("titleEn") || "").trim();
  const titleEs = String(formData.get("titleEs") || "").trim();
  const descEn = String(formData.get("descEn") || "").trim();
  const descEs = String(formData.get("descEs") || "").trim();
  // Preferred path: the browser already uploaded straight to Blob storage
  // (see lib/client-upload.ts) and this is just the resulting URL. Falls
  // back to a raw File field when direct upload wasn't available (e.g.
  // local dev with no Blob store configured).
  const directUrl = String(formData.get("imageUrl") || "").trim() || null;
  const raw = formData.get("image");
  const imageFile = !directUrl && raw instanceof File && raw.size > 0 ? raw : null;

  if (!titleEn || !titleEs) return { error: "Title is required in both English and Spanish." };
  if (!id && !directUrl && !imageFile) return { error: "Choose a photograph to upload." };
  if (imageFile && imageFile.size > MAX_UPLOAD_BYTES) {
    return { error: `That photo is too large (${(imageFile.size / 1024 / 1024).toFixed(1)}MB). Please use one under ${MAX_UPLOAD_MB}MB.` };
  }

  if (id) {
    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return { error: "That photograph no longer exists." };
    let imageUrl = existing.imageUrl;
    if (directUrl) {
      imageUrl = directUrl;
      await removeImage(existing.imageUrl);
    } else if (imageFile) {
      imageUrl = await saveImage(imageFile, "photos");
      await removeImage(existing.imageUrl);
    }
    await prisma.photo.update({ where: { id }, data: { titleEn, titleEs, descEn, descEs, imageUrl } });
    revalidatePath(`/exhibition/${id}`);
  } else {
    const imageUrl = directUrl ?? (await saveImage(imageFile!, "photos"));
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
