import type { Metadata } from "next"
import { Cormorant_Garamond, Caveat } from "next/font/google"

import "./globals.css"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

const hand = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hand",
})

export const metadata: Metadata = {
  title: "For Gaby — A Bittersweet Farewell",
  description: "A letter for Gabrielle, from the star in the distant sky.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${serif.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  )
}
