import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || site.name;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          background: "#0c0c0d",
          color: "#ececef",
          padding: "72px",
          fontFamily: "Georgia, ui-serif, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6e6e73",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "90%",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
