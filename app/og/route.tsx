import { ImageResponse } from "next/og";
import { MARK_RATIO, markDataUri } from "@/lib/mark";
import { site } from "@/lib/site";

export const runtime = "edge";

/**
 * The card is set in the site's own typeface, which means shipping the file:
 * satori has no font stack to fall back through, and a share card set in
 * Helvetica is a share card for some other site. Two weights, read as URLs so
 * the build traces them into the bundle.
 */
const fonts = Promise.all(
  (
    [
      ["Geist", 400, new URL("./Geist-Regular.ttf", import.meta.url)],
      ["Geist", 600, new URL("./Geist-SemiBold.ttf", import.meta.url)],
    ] as const
  ).map(async ([name, weight, url]) => ({
    name,
    weight,
    style: "normal" as const,
    data: await fetch(url).then((response) => response.arrayBuffer()),
  })),
);

/** Set to the cap height of the name beside it, so the two sit on one line. */
const MARK_HEIGHT = 19;

export async function GET(request: Request) {
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
          background: "#09090b",
          color: "#fafafa",
          padding: "72px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#a1a1aa",
            letterSpacing: "-0.02em",
          }}
        >
          {/* The site's own mark, not a stand-in for it — this card is the
              only thing most people see before they see the site. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- satori rasterises this; next/image has no meaning here */}
          <img
            src={markDataUri("#fafafa")}
            width={Math.round(MARK_HEIGHT * MARK_RATIO)}
            height={MARK_HEIGHT}
            alt=""
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
            color: "#71717a",
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
      fonts: await fonts,
    },
  );
}
