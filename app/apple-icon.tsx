import { ImageResponse } from "next/og";
import { cubeDataUri } from "@/lib/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
        <img src={cubeDataUri("#fafafa")} width={104} height={104} alt="" />
      </div>
    ),
    size,
  );
}
