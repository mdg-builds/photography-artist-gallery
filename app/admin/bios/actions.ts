"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveImage, removeImage } from "@/lib/storage";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload-limits";

export type BioFormState = { ok: true } | { error: string } | undefined;

export async function saveBio(_prev: BioFormState, formData: FormData): Promise<BioFormState> {
  const id = String(formData.get("id") || "") || null;
  const name = String(formData.get("name") || "").trim();
  const roleEn = String(formData.get("roleEn") || "").trim();
  const roleEs = String(formData.get("roleEs") || "").trim();
  const bodyEn = String(formData.get("bodyEn") || "").trim();
  const bodyEs = String(formData.get("bodyEs") || "").trim();
  const directUrl = String(formData.get("imageUrl") || "").trim() || null;
  const raw = formData.get("image");
  const imageFile = !directUrl && raw instanceof File && raw.size > 0 ? raw : null;

  if (!name) return { error: "Name is required." };
  if (imageFile && imageFile.size > MAX_UPLOAD_BYTES) {
    return { error: `That photo is too large (${(imageFile.size / 1024 / 1024).toFixed(1)}MB). Please use one under ${MAX_UPLOAD_MB}MB.` };
  }

  if (id) {
    const existing = await prisma.bio.findUnique({ where: { id } });
    if (!existing) return { error: "That bio no longer exists." };
    let imageUrl = existing.imageUrl;
    if (directUrl) {
      imageUrl = directUrl;
      await removeImage(existing.imageUrl);
    } else if (imageFile) {
      imageUrl = await saveImage(imageFile, "bios");
      await removeImage(existing.imageUrl);
    }
    await prisma.bio.update({ where: { id }, data: { name, roleEn, roleEs, bodyEn, bodyEs, imageUrl } });
  } else {
    const imageUrl = directUrl ?? (imageFile ? await saveImage(imageFile, "bios") : null);
    const maxOrder = await prisma.bio.aggregate({ _max: { order: true } });
    await prisma.bio.create({
      data: { name, roleEn, roleEs, bodyEn, bodyEs, imageUrl, order: (maxOrder._max.order ?? -1) + 1 },
    });
  }

  revalidatePath("/admin/bios");
  revalidatePath("/about");
  return { ok: true };
}

export async function deleteBio(id: string) {
  const existing = await prisma.bio.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.bio.delete({ where: { id } });
  await removeImage(existing.imageUrl);
  revalidatePath("/admin/bios");
  revalidatePath("/about");
}

export async function reorderBio(id: string, direction: "up" | "down") {
  const bios = await prisma.bio.findMany({ orderBy: { order: "asc" } });
  const idx = bios.findIndex((b) => b.id === id);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= bios.length) return;
  const a = bios[idx];
  const b = bios[swapWith];
  await prisma.$transaction([
    prisma.bio.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.bio.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/admin/bios");
  revalidatePath("/about");
}
