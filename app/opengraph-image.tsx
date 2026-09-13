import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OpengraphImage() {
  const content = await getSiteContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#131110",
          color: "#f3f2f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, color: "#ec3013", marginBottom: 24 }}>
          A PHOTOGRAPHY EXHIBITION
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>{content.brand}</div>
        {content.heroSubtitleEn && (
          <div style={{ display: "flex", fontSize: 32, fontStyle: "italic", opacity: 0.85, marginTop: 20 }}>
            {content.heroSubtitleEn}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
