"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveImage, removeImage } from "@/lib/storage";

export type ContentFormState = { ok: true } | { error: string } | undefined;

export async function saveSiteContent(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const brand = String(formData.get("brand") || "").trim();
  const heroSubtitleEn = String(formData.get("heroSubtitleEn") || "").trim();
  const heroSubtitleEs = String(formData.get("heroSubtitleEs") || "").trim();
  const heroCreditEn = String(formData.get("heroCreditEn") || "").trim();
  const heroCreditEs = String(formData.get("heroCreditEs") || "").trim();
  const statementEn = String(formData.get("statementEn") || "").trim();
  const statementEs = String(formData.get("statementEs") || "").trim();
  const footerCreditEn = String(formData.get("footerCreditEn") || "").trim();
  const footerCreditEs = String(formData.get("footerCreditEs") || "").trim();

  if (!brand) return { error: "The site name cannot be empty." };

  const existing = await prisma.siteContent.findUnique({ where: { id: 1 } });

  const raw = formData.get("heroImage");
  const heroImageFile = raw instanceof File && raw.size > 0 ? raw : null;
  let heroImageUrl = existing?.heroImageUrl ?? null;
  if (heroImageFile) {
    heroImageUrl = await saveImage(heroImageFile, "site");
    await removeImage(existing?.heroImageUrl);
  }

  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      brand,
      heroSubtitleEn,
      heroSubtitleEs,
      heroCreditEn,
      heroCreditEs,
      heroImageUrl,
      statementEn,
      statementEs,
      footerCreditEn,
      footerCreditEs,
    },
    update: {
      brand,
      heroSubtitleEn,
      heroSubtitleEs,
      heroCreditEn,
      heroCreditEs,
      heroImageUrl,
      statementEn,
      statementEs,
      footerCreditEn,
      footerCreditEs,
    },
  });

  revalidatePath("/admin/content", "layout");
  revalidatePath("/");
  revalidatePath("/exhibition");
  revalidatePath("/about");
  return { ok: true };
}
