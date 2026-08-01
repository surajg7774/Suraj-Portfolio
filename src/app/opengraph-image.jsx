import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { COLORS } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Programmatically generated with next/og using the site's real color
// tokens — no fabricated graphic asset.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: COLORS.bg,
          color: COLORS.text,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            color: COLORS.accent,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: COLORS.accent,
            }}
          />
          {profile.status}
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, marginTop: 28 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 42, color: COLORS.textMuted, marginTop: 18 }}>
          {profile.title}
        </div>
      </div>
    ),
    { ...size }
  );
}
