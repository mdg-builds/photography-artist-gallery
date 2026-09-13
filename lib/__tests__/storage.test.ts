import { describe, expect, it, afterEach, beforeAll } from "vitest";
import { access } from "node:fs/promises";
import path from "node:path";
import { saveImage, removeImage } from "../storage";

const savedUrls: string[] = [];

beforeAll(() => {
  // Force the local-filesystem fallback path (no Vercel Blob token in tests).
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  await Promise.all(savedUrls.splice(0).map((url) => removeImage(url)));
});

function fakeFile(name: string, content = "fake-image-bytes") {
  return new File([content], name, { type: "image/jpeg" });
}

describe("saveImage (local fallback)", () => {
  it("writes the file under public/uploads and returns a matching URL", async () => {
    const url = await saveImage(fakeFile("portrait.jpg"), "photos");
    savedUrls.push(url);

    expect(url).toMatch(/^\/uploads\/photos\/[^/]+\.jpg$/);
    const onDisk = path.join(process.cwd(), "public", url);
    await expect(access(onDisk)).resolves.toBeUndefined();
  });

  it("gives two uploads of the same filename different URLs", async () => {
    const a = await saveImage(fakeFile("same.jpg"), "photos");
    const b = await saveImage(fakeFile("same.jpg"), "photos");
    savedUrls.push(a, b);
    expect(a).not.toEqual(b);
  });

  it("drops an unsafe/invalid extension rather than trusting the filename", async () => {
    const url = await saveImage(fakeFile("evil.jpg.exe"), "photos");
    savedUrls.push(url);
    expect(url).not.toMatch(/\.exe$/);
  });
});

describe("removeImage", () => {
  it("silently no-ops for a file that doesn't exist", async () => {
    await expect(removeImage("/uploads/photos/does-not-exist.jpg")).resolves.toBeUndefined();
  });

  it("silently no-ops for null/undefined", async () => {
    await expect(removeImage(null)).resolves.toBeUndefined();
    await expect(removeImage(undefined)).resolves.toBeUndefined();
  });

  it("actually deletes a file it previously saved", async () => {
    const url = await saveImage(fakeFile("to-delete.jpg"), "photos");
    const onDisk = path.join(process.cwd(), "public", url);
    await expect(access(onDisk)).resolves.toBeUndefined();

    await removeImage(url);
    await expect(access(onDisk)).rejects.toThrow();
  });
});
