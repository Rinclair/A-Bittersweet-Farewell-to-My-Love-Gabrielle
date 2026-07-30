"use client"

export function FountainPenDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* soft cast shadow under the pen */}
      <path
        d="M48 142 L460 62 C480 58 494 68 490 82 L486 96 C482 108 466 114 448 118 L52 186 C34 190 18 180 22 166 L28 150 C32 138 30 146 48 142 Z"
        fill="#000"
        fillOpacity="0.14"
      />

      {/* nib (left/end of pen) */}
      <path
        d="M0 162 L64 150 L76 178 L12 190 Z"
        fill="url(#nibGold)"
      />
      <path
        d="M38 155 L44 184"
        stroke="#7a5c1d"
        strokeWidth="2"
      />
      <path
        d="M12 190 L44 184 L76 178 L64 150 L0 162 Z"
        fill="url(#nibGoldDark)"
      />

      {/* feed / section */}
      <path
        d="M76 178 L140 166 L156 202 L92 214 Z"
        fill="#1f2433"
      />

      {/* grip */}
      <path
        d="M156 202 L260 182 L284 230 L180 250 Z"
        fill="#0f111a"
      />

      {/* cap band */}
      <path
        d="M260 182 L284 230 L316 224 L292 176 Z"
        fill="url(#nibGold)"
      />

      {/* barrel */}
      <path
        d="M292 176 L316 224 L500 190 L476 142 Z"
        fill="url(#barrelRed)"
      />

      {/* barrel end cap */}
      <path
        d="M476 142 L500 190 L520 186 L496 138 Z"
        fill="url(#nibGold)"
      />

      {/* barrel highlights */}
      <path
        d="M320 198 L480 168"
        stroke="#fff"
        strokeWidth="5"
        strokeOpacity="0.14"
        strokeLinecap="round"
      />
      <path
        d="M330 212 L470 186"
        stroke="#fff"
        strokeWidth="3"
        strokeOpacity="0.08"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="nibGold" x1="0" y1="162" x2="520" y2="186" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4d57a" />
          <stop offset="1" stopColor="#b89336" />
        </linearGradient>
        <linearGradient id="nibGoldDark" x1="0" y1="162" x2="76" y2="178" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4b056" />
          <stop offset="1" stopColor="#9e7c28" />
        </linearGradient>
        <linearGradient id="barrelRed" x1="292" y1="176" x2="500" y2="190" gradientUnits="userSpaceOnUse">
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
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* outer shadow */}
      <circle cx="102" cy="102" r="92" fill="#000" fillOpacity="0.12" />

      {/* glass rim / body */}
      <circle cx="100" cy="100" r="88" fill="url(#glassTop)" stroke="#2a2a2a" strokeWidth="2" />

      {/* ink pool */}
      <circle cx="100" cy="100" r="78" fill="#1a0f2e" />

      {/* ink surface highlight */}
      <ellipse cx="86" cy="82" rx="34" ry="22" fill="#2a1b4a" transform="rotate(-25 86 82)" />

      {/* inner glass reflection */}
      <path
        d="M44 70 A60 60 0 0 1 160 82"
        stroke="#fff"
        strokeWidth="4"
        strokeOpacity="0.12"
        strokeLinecap="round"
        fill="none"
      />

      {/* cork / stopper top */}
      <circle cx="100" cy="100" r="22" fill="url(#corkTop)" stroke="#5c4320" strokeWidth="1.5" />

      {/* cork texture rings */}
      <circle cx="100" cy="100" r="16" stroke="#7a5c30" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      <circle cx="100" cy="100" r="10" stroke="#7a5c30" strokeWidth="1" strokeOpacity="0.5" fill="none" />

      {/* label band across the glass rim */}
      <path
        d="M28 128 A88 88 0 0 0 172 128"
        stroke="#f1e5c6"
        strokeWidth="14"
        strokeOpacity="0.85"
        fill="none"
      />
      <path
        d="M32 128 A84 84 0 0 0 168 128"
        stroke="#5c4320"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M48 144 A72 72 0 0 0 152 144"
        stroke="#5c4320"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M58 154 A62 62 0 0 0 142 154"
        stroke="#5c4320"
        strokeWidth="1"
        fill="none"
      />

      <defs>
        <radialGradient id="glassTop" cx="100" cy="100" r="88" gradientUnits="userSpaceOnUse">
          <stop offset="0.7" stopColor="#d4e4f0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#8aaabf" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="corkTop" cx="100" cy="100" r="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9a86a" />
          <stop offset="1" stopColor="#8f6f3f" />
        </radialGradient>
      </defs>
    </svg>
  )
}
