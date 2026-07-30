import type { Metadata } from "next"
import { La_Belle_Aurore, Special_Elite } from "next/font/google"

import "./globals.css"

const script = La_Belle_Aurore({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
})

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-type",
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
    <html lang="en" className={`${script.variable} ${typewriter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
