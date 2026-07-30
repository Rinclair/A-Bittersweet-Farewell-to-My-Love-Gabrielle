"use client"

import { useEffect, useState } from "react"

import {
  currentLyricWordIndex,
  lineIndexForWord,
  lyricWords,
  wordStartIndexForLine,
  wordsForLine,
  type LyricWord,
} from "@/lib/song-lyrics"
import { cn } from "@/lib/utils"

interface FloatingLyricsProps {
  currentTime: number
}

function currentLineIndex(time: number): number {
  const idx = currentLyricWordIndex(time)
  return lineIndexForWord(idx)
}

function WordStack({
  words,
  activeWordIndex,
}: {
  words: LyricWord[]
  activeWordIndex: number
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {words.map((word, idx) => {
        const visible = idx <= activeWordIndex
        const current = idx === activeWordIndex
        return (
          <span
            key={`${word.time}-${word.text}`}
            className={cn(
              "font-serif italic transition-all ease-out",
              current
                ? "text-5xl text-[#e8dcc0]/95 duration-150 sm:text-7xl"
                : visible
                  ? "text-3xl text-[#e8dcc0]/30 duration-500 sm:text-5xl"
                  : "text-3xl text-[#e8dcc0]/0 duration-300 sm:text-5xl"
            )}
          >
            {word.text}
          </span>
        )
      })}
    </div>
  )
}

export function FloatingLyrics({ currentTime }: FloatingLyricsProps) {
  const [leftLineIndex, setLeftLineIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(0)

  useEffect(() => {
    const wordIdx = currentLyricWordIndex(currentTime)
    setLeftLineIndex(lineIndexForWord(wordIdx))
    setActiveWordIndex(wordIdx)
  }, [currentTime])

  const leftWords = wordsForLine(leftLineIndex)
  const rightWords = wordsForLine(leftLineIndex + 1)

  // Find which word within each line is currently active.
  const leftStart = wordStartIndexForLine(leftLineIndex)
  const rightStart = wordStartIndexForLine(leftLineIndex + 1)
  const leftActiveIndex = activeWordIndex - leftStart
  const rightActiveIndex = activeWordIndex - rightStart

  return (
    <>
      {/* current line, left of the letter */}
      <div className="pointer-events-none fixed left-2 top-1/2 z-20 hidden -translate-y-1/2 sm:left-8 sm:block">
        <WordStack words={leftWords} activeWordIndex={leftActiveIndex} />
      </div>

      {/* next line, right of the letter */}
      <div className="pointer-events-none fixed right-2 top-1/2 z-20 hidden -translate-y-1/2 text-right sm:right-8 sm:block">
        <WordStack words={rightWords} activeWordIndex={rightActiveIndex} />
      </div>
    </>
  )
}
