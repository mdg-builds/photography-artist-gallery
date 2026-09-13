"use client";

import { upload } from "@vercel/blob/client";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

/**
 * Uploads a file directly from the browser to Blob storage, bypassing this
 * app's own server entirely for the file bytes. Returns the resulting public
 * URL, or null if direct upload isn't available (e.g. local dev with no
 * Blob store configured) — callers should fall back to attaching the raw
 * File to the form and letting the server action handle it in that case.
 */
export async function tryDirectUpload(file: File, folder: string): Promise<string | null> {
  try {
    const match = file.name.match(/\.[a-zA-Z0-9]+$/);
    const ext = match && ALLOWED_EXTENSIONS.has(match[0].toLowerCase()) ? match[0].toLowerCase() : ".jpg";
    const pathname = `${folder}/${crypto.randomUUID()}${ext}`;
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/blob-upload",
    });
    return blob.url;
  } catch {
    return null;
  }
}
