"use client"

export function TapeRecorder({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 280 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-2xl"
      >
        {/* body */}
        <rect
          x="10"
          y="20"
          width="260"
          height="150"
          rx="12"
          fill="url(#recorderBody)"
          stroke="#3d2f14"
          strokeWidth="2"
        />
        {/* handle */}
        <path
          d="M80 20 V8 Q80 2 86 2 H194 Q200 2 200 8 V20"
          stroke="#4a3b22"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* speaker grille */}
        <circle cx="230" cy="95" r="32" fill="#2a2419" />
        {[0, 30, 60, 90, 120, 150].map((angle) => (
          <line
            key={angle}
            x1={230 + Math.cos((angle * Math.PI) / 180) * 10}
            y1={95 + Math.sin((angle * Math.PI) / 180) * 10}
            x2={230 + Math.cos((angle * Math.PI) / 180) * 28}
            y2={95 + Math.sin((angle * Math.PI) / 180) * 28}
            stroke="#5c4d30"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* tape window */}
        <rect
          x="45"
          y="55"
          width="140"
          height="70"
          rx="6"
          fill="#1a1612"
          stroke="#4a3b22"
          strokeWidth="2"
        />

        {/* left reel */}
        <g className="origin-[85px_90px] animate-spin-slow">
          <circle cx="85" cy="90" r="26" fill="#2a2419" stroke="#5c4d30" strokeWidth="2" />
          {[0, 45, 90, 135].map((angle) => (
            <rect
              key={angle}
              x={83}
              y={66}
              width="4"
              height="12"
              rx="1"
              fill="#8f6f3f"
              transform={`rotate(${angle} 85 90)`}
            />
          ))}
        </g>

        {/* right reel */}
        <g className="origin-[145px_90px] animate-spin-slow">
          <circle cx="145" cy="90" r="26" fill="#2a2419" stroke="#5c4d30" strokeWidth="2" />
          {[0, 45, 90, 135].map((angle) => (
            <rect
              key={angle}
              x={143}
              y={66}
              width="4"
              height="12"
              rx="1"
              fill="#8f6f3f"
              transform={`rotate(${angle} 145 90)`}
            />
          ))}
        </g>

        {/* tape strip */}
        <path
          d="M59 90 H111 V90 H119 V90 H171 V90 H119 V90 H111 Z"
          fill="#c9a86a"
          opacity="0.6"
        />

        {/* play light */}
        <circle cx="210" cy="145" r="6" fill="#e06666" className="animate-pulse" />

        {/* control buttons */}
        <rect x="50" y="142" width="18" height="10" rx="2" fill="#4a3b22" />
        <rect x="75" y="142" width="18" height="10" rx="2" fill="#4a3b22" />
        <rect x="100" y="142" width="18" height="10" rx="2" fill="#4a3b22" />

        {/* label plate */}
        <rect x="150" y="138" width="80" height="18" rx="2" fill="#f7f1e3" />
        <text
          x="190"
          y="150"
          textAnchor="middle"
          className="font-type"
          fill="#3d2f14"
          fontSize="8"
          letterSpacing="1"
        >
          EVAN&apos;S VOICE
        </text>

        <defs>
          <linearGradient id="recorderBody" x1="10" y1="20" x2="270" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8dcc0" />
            <stop offset="1" stopColor="#c8a263" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
