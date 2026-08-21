import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #0f172a 100%)",
          borderRadius: "8px",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 9L18.5 13.5L23 16L18.5 18.5L16 23L13.5 18.5L9 16L13.5 13.5L16 9Z"
            fill="#a5b4fc"
            opacity="0.75"
          />
          <path
            d="M16 2C16 10 10 16 2 16C10 16 16 22 16 30C16 22 22 16 30 16C22 16 16 10 16 2Z"
            fill="#ffffff"
          />
          <circle cx="16" cy="16" r="2.2" fill="#4f46e5" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
