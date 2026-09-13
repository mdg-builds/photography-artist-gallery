import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function safeExt(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.has(ext) ? ext : ".jpg";
}

/**
 * Stores an uploaded image and returns its public URL. Uses Vercel Blob when
 * BLOB_READ_WRITE_TOKEN is configured; otherwise falls back to writing under
 * public/uploads so the app also works in local dev with no Vercel account.
 */
export async function saveImage(file: File, folder: string): Promise<string> {
  const filename = `${folder}/${randomUUID()}${safeExt(file.name)}`;

  if (hasBlob) {
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const localPath = path.join(dir, path.basename(filename));
  await writeFile(localPath, buffer);
  return `/uploads/${folder}/${path.basename(filename)}`;
}

/** Best-effort delete of a previously saved image; never throws. */
export async function removeImage(url: string | null | undefined) {
  if (!url) return;
  try {
    if (url.includes("blob.vercel-storage.com")) {
      await del(url);
    } else if (url.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", url));
    }
  } catch {
    // Ignore: the file may already be gone, or storage may be unreachable.
  }
}
