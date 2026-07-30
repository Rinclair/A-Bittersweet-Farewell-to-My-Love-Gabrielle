"use client"

export function FountainPenDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* pen shadow */}
      <path
        d="M64 36 L78 48 L72 460 L58 452 Z"
        fill="#000"
        fillOpacity="0.12"
      />
      {/* nib */}
      <path
        d="M44 0 L76 0 L68 92 L52 92 Z"
        fill="url(#nibGold)"
      />
      <path
        d="M60 0 L60 76"
        stroke="#7a5c1d"
        strokeWidth="1.5"
      />
      <path
        d="M52 92 L60 76 L68 92"
        fill="#f4d57a"
      />
      {/* feed / section */}
      <rect x="50" y="92" width="20" height="36" rx="2" fill="#1f2433" />
      {/* grip */}
      <rect x="48" y="128" width="24" height="64" rx="3" fill="#0f111a" />
      {/* barrel */}
      <rect x="46" y="192" width="28" height="232" rx="4" fill="url(#barrelRed)" />
      {/* cap band */}
      <rect x="44" y="184" width="32" height="14" rx="1" fill="url(#nibGold)" />
      <rect x="44" y="424" width="32" height="14" rx="1" fill="url(#nibGold)" />
      {/* highlight */}
      <path
        d="M52 200 L52 416"
        stroke="#fff"
        strokeWidth="3"
        strokeOpacity="0.18"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="nibGold" x1="60" y1="0" x2="60" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4d57a" />
          <stop offset="1" stopColor="#b89336" />
        </linearGradient>
        <linearGradient id="barrelRed" x1="46" y1="192" x2="74" y2="424" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9e1b1b" />
          <stop offset="0.5" stopColor="#6d1414" />
          <stop offset="1" stopColor="#4a0d0d" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function InkBottleDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* bottle shadow */}
      <ellipse cx="76" cy="166" rx="54" ry="10" fill="#000" fillOpacity="0.14" />
      {/* body */}
      <path
        d="M24 52 L24 148 C24 162 46 170 70 170 C94 170 116 162 116 148 L116 52 C116 38 94 30 70 30 C46 30 24 38 24 52 Z"
        fill="url(#glass)"
        stroke="#2a2a2a"
        strokeWidth="2"
      />
      {/* ink fill */}
      <path
        d="M30 70 L30 146 C30 157 48 164 70 164 C92 164 110 157 110 146 L110 70 C110 82 92 90 70 90 C48 90 30 82 30 70 Z"
        fill="#1a0f2e"
      />
      {/* ink surface */}
      <ellipse cx="70" cy="70" rx="40" ry="12" fill="#2a1b4a" />
      {/* neck */}
      <rect x="52" y="14" width="36" height="22" rx="2" fill="#1a1a1a" />
      {/* cork / stopper */}
      <rect x="48" y="4" width="44" height="14" rx="3" fill="url(#cork)" />
      {/* label */}
      <rect x="38" y="100" width="64" height="34" rx="2" fill="#f1e5c6" />
      <rect x="42" y="104" width="56" height="26" rx="1" fill="none" stroke="#5c4320" strokeWidth="1" />
      <path d="M48 114 L92 114" stroke="#5c4320" strokeWidth="1.5" />
      <path d="M52 122 L74 122" stroke="#5c4320" strokeWidth="1.5" />
      {/* glass shine */}
      <path
        d="M34 56 L34 140"
        stroke="#fff"
        strokeWidth="3"
        strokeOpacity="0.16"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="glass" x1="24" y1="30" x2="116" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4e4f0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8aaabf" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="cork" x1="48" y1="4" x2="92" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9a86a" />
          <stop offset="1" stopColor="#8f6f3f" />
        </linearGradient>
      </defs>
    </svg>
  )
}
