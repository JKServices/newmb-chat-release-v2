import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "뉴MB.chat";
export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          color: "#ffffff",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: "rgba(107,188,255,0.16)",
            top: -280,
            left: 280
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 42,
            border: "2px solid rgba(255,255,255,0.18)",
            borderRadius: 54
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 84,
            top: 82,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              color: "#8e8e93",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 30
            }}
          >
            Unofficial parody AI
          </div>

          <div
            style={{
              fontSize: 106,
              fontWeight: 950,
              letterSpacing: "-0.09em",
              lineHeight: 1
            }}
          >
            뉴MB.chat
          </div>

          <div
            style={{
              width: 190,
              height: 12,
              borderRadius: 999,
              background: "#ff2d55",
              marginTop: 42,
              marginBottom: 42
            }}
          />

          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              lineHeight: 1.35,
              color: "#f5f5f7",
              maxWidth: 780
            }}
          >
            애매한 하루도 경기 후 인터뷰처럼.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: 68,
            color: "#8e8e93",
            fontSize: 28,
            fontWeight: 700
          }}
        >
          newmb.chat
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
