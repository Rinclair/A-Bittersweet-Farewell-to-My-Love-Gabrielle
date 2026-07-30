"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

interface ListenPlayerProps {
  audio: HTMLAudioElement | null
  playing: boolean
  priorDuration: number
  totalDuration: number
  onToggle: () => void
  onStop: () => void
}

export function ListenPlayer({
  audio,
  playing,
  priorDuration,
  totalDuration,
  onToggle,
  onStop,
}: ListenPlayerProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!playing || !audio) return
    let raf = 0
    const tick = () => {
      if (totalDuration > 0) {
        setProgress(
          Math.min(1, (priorDuration + audio.currentTime) / totalDuration)
        )
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, audio, priorDuration, totalDuration])

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full bg-[#f7f1e3] py-2 pl-3 pr-4 shadow-2xl ring-1 ring-black/10">
        <Button
          type="button"
          onClick={onToggle}
          aria-label={playing ? "Pause narration" : "Resume narration"}
          className="h-9 w-9 rounded-full p-0 text-xs"
        >
          {playing ? "❚❚" : "▶"}
        </Button>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
            Evan reads the letter
          </span>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-stone-300 sm:w-56">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop narration"
          className="pl-1 text-sm text-stone-400 transition-colors hover:text-stone-700"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
