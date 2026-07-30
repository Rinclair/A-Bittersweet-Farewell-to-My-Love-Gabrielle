"use client"

import { useEffect, useState } from "react"

import { currentLyricWordIndex, lyricWords } from "@/lib/song-lyrics"

interface FloatingLyricsProps {
  currentTime: number
}

export function FloatingLyrics({ currentTime }: FloatingLyricsProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(currentLyricWordIndex(currentTime))
  }, [currentTime])

  const previous = lyricWords[index - 1]
  const current = lyricWords[index]
  const next = lyricWords[index + 1]

  return (
    <>
      {/* current word, left of the letter */}
      <div className="pointer-events-none fixed left-2 top-1/2 z-20 hidden max-w-[18vw] -translate-y-1/2 text-right sm:left-6 sm:block">
        {previous && (
          <p className="font-serif text-2xl italic text-[#e8dcc0]/30 transition-opacity duration-500 sm:text-3xl">
            {previous.text}
          </p>
        )}
        {current && (
          <p className="mt-4 font-serif text-4xl italic text-[#e8dcc0]/95 transition-opacity duration-500 sm:text-6xl">
            {current.text}
          </p>
        )}
      </div>

      {/* next word, right of the letter */}
      <div className="pointer-events-none fixed right-2 top-1/2 z-20 hidden max-w-[18vw] -translate-y-1/2 text-left sm:right-6 sm:block">
        {next && (
          <p className="font-serif text-3xl italic text-[#e8dcc0]/45 transition-opacity duration-500 sm:text-5xl">
            {next.text}
          </p>
        )}
      </div>
    </>
  )
}
