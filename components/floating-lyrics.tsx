"use client"

import { useEffect, useState } from "react"

import { currentLyricIndex, lyrics } from "@/lib/song-lyrics"

interface FloatingLyricsProps {
  currentTime: number
}

export function FloatingLyrics({ currentTime }: FloatingLyricsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(currentLyricIndex(currentTime))
  }, [currentTime])

  const previous = lyrics[activeIndex - 1]
  const current = lyrics[activeIndex]
  const next = lyrics[activeIndex + 1]
  const upcoming = lyrics[activeIndex + 2]

  return (
    <>
      {/* left side */}
      <div className="pointer-events-none fixed left-2 top-1/2 z-20 hidden max-w-[14vw] -translate-y-1/2 text-right sm:left-6 sm:block">
        {previous && (
          <p className="font-serif text-sm italic text-[#e8dcc0]/40 transition-opacity duration-700 sm:text-base">
            {previous.text}
          </p>
        )}
        {current && (
          <p className="mt-2 font-serif text-lg italic text-[#e8dcc0]/90 transition-opacity duration-700 sm:text-xl">
            {current.text}
          </p>
        )}
      </div>

      {/* right side */}
      <div className="pointer-events-none fixed right-2 top-1/2 z-20 hidden max-w-[14vw] -translate-y-1/2 text-left sm:right-6 sm:block">
        {next && (
          <p className="font-serif text-base italic text-[#e8dcc0]/70 transition-opacity duration-700 sm:text-lg">
            {next.text}
          </p>
        )}
        {upcoming && (
          <p className="mt-2 font-serif text-sm italic text-[#e8dcc0]/40 transition-opacity duration-700 sm:text-base">
            {upcoming.text}
          </p>
        )}
      </div>
    </>
  )
}
