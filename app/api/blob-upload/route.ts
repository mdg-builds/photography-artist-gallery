import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

// Issues short-lived client upload tokens so admin forms can upload photos
// directly from the browser to Blob storage, bypassing this server's own
// request body limits entirely (only the resulting URL passes through the
// Server Actions afterward, not the file bytes).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session) {
          throw new Error("Not authenticated");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
        };
      },
      onUploadCompleted: async () => {
        // No-op: the calling form's server action persists the resulting
        // URL once the client reports the upload as complete.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
