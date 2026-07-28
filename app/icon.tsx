import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Site mark as favicon — rounded ink square, inner background dot. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "7px",
          background: "#1c1917",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "2px",
            background: "#fafaf9",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
