import { ImageResponse } from "next/og";
import { MARK_RATIO, markDataUri } from "@/lib/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The mark is a wordmark, so it is sized off the plate's width, not its box. */
const WIDTH = 132;

/**
 * iOS composites the home-screen icon onto its own rounded plate and honours
 * no transparency worth relying on, so this one carries its own ground: the
 * dark background and light mark, fixed, because the icon is stamped at build
 * time and has no theme to follow.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <img
          src={markDataUri("#fafafa")}
          width={WIDTH}
          height={Math.round(WIDTH / MARK_RATIO)}
          alt=""
        />
      </div>
    ),
    size,
  );
}
