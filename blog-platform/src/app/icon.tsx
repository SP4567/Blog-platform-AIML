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
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #090d16 100%)",
          borderRadius: "8px",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neural Synaptic Connections */}
          <path
            d="M7 8L20 16M7 16L20 16M7 24L20 16M20 16L28 16"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Input Nodes */}
          <circle cx="7" cy="8" r="2.5" fill="#38bdf8" />
          <circle cx="7" cy="16" r="2.5" fill="#818cf8" />
          <circle cx="7" cy="24" r="2.5" fill="#c084fc" />

          {/* Central Activation Nucleus */}
          <circle cx="20" cy="16" r="4.2" fill="#ffffff" />

          {/* Output Node */}
          <circle cx="28" cy="16" r="2" fill="#67e8f9" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
