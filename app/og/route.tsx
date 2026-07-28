import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = (url.searchParams.get("title") || site.name).slice(0, 140);
  const origin = new URL(site.url).host;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          background: "#fafaf9",
          color: "#1c1917",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              background: "#1c1917",
            }}
          >
            <div
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "2px",
                background: "#fafaf9",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#57534e",
              letterSpacing: "-0.02em",
            }}
          >
            {site.name}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 48 : 64,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 1.08,
            maxWidth: "92%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#8b8b88",
            letterSpacing: "-0.01em",
          }}
        >
          {origin}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
