import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = (url.searchParams.get("title") || site.name).slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          background: "#0a0a0c",
          color: "#ededf0",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#8f8f97",
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#4f74ff",
            }}
          />
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 48 : 64,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.12,
            maxWidth: "92%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#63636c",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          dhruv2mars.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
