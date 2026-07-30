import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "cursive"],
        hand: ["var(--font-serif)", "cursive"],
        type: ["var(--font-type)", "monospace"],
      },
    },
  },
  plugins: [],
}
export default config
