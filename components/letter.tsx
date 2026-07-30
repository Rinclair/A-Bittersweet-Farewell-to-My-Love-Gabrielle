"use client"

import { useEffect, useRef, useState } from "react"

import { Envelope } from "@/components/envelope"
import { ListenPlayer } from "@/components/listen-player"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { letterBlocks, type LetterBlock } from "@/lib/letter-content"
import { narration, narrationAvailable, timingByKey } from "@/lib/narration"
import { cn } from "@/lib/utils"

interface TrackWord {
  key: string
  start: number
  end: number
}

// Timed words grouped per track, sorted by start time.
const wordsByTrack: TrackWord[][] = narration.tracks.map((_, trackIndex) =>
  Object.entries(narration.blocks)
    .flatMap(([blockId, words]) =>
      words
        .map((word, index) => ({ key: `${blockId}:${index}`, ...word }))
        .filter(
          (word) =>
            word.track === trackIndex && word.start !== null && word.end !== null
        )
        .map((word) => ({
          key: word.key,
          start: word.start as number,
          end: word.end as number,
        }))
    )
    .sort((a, b) => a.start - b.start)
)

// Global reveal order of timed words (track 0 first, then track 1).
const revealOrder = new Map<string, number>(
  wordsByTrack.flat().map((word, index) => [word.key, index])
)

function activeWordAt(track: number, t: number): string | null {
  const words = wordsByTrack[track]
  let active: string | null = null
  for (const word of words) {
    if (word.start <= t) active = word.key
    else break
  }
  return active
}

export function Letter() {
  const [opened, setOpened] = useState(false)
  const [mode, setMode] = useState<"read" | "listen">("read")
  const [playing, setPlaying] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [durations, setDurations] = useState<number[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const trackRef = useRef(0)
  const durationsRef = useRef<number[]>([])
  const activeKeyRef = useRef<string | null>(null)
  const playingRef = useRef(false)
  const rafRef = useRef(0)

  function stopListening() {
    audioRef.current?.pause()
    playingRef.current = false
    setPlaying(false)
    setMode("read")
    activeKeyRef.current = null
    setActiveKey(null)
  }

  function ensureAudio() {
    if (audioRef.current) return audioRef.current
    const audio = new Audio()
    audio.preload = "auto"
    audio.addEventListener("loadedmetadata", () => {
      durationsRef.current[trackRef.current] = audio.duration
      setDurations([...durationsRef.current])
    })
    audio.addEventListener("ended", () => {
      if (trackRef.current < narration.tracks.length - 1) {
        trackRef.current += 1
        setTrackIndex(trackRef.current)
        audio.src = narration.tracks[trackRef.current]
        void audio.play()
      } else {
        stopListening()
      }
    })
    audioRef.current = audio
    return audio
  }

  function toggleListen() {
    if (!narrationAvailable) return
    const audio = ensureAudio()
    if (mode === "read") {
      trackRef.current = 0
      setTrackIndex(0)
      audio.src = narration.tracks[0]
      setMode("listen")
      void audio.play()
      playingRef.current = true
      setPlaying(true)
      return
    }
    if (playingRef.current) {
      audio.pause()
      playingRef.current = false
      setPlaying(false)
    } else {
      void audio.play()
      playingRef.current = true
      setPlaying(true)
    }
  }

  // Track the spoken word while playing.
  useEffect(() => {
    if (!playing) return
    const tick = () => {
      const audio = audioRef.current
      if (audio) {
        const key = activeWordAt(trackRef.current, audio.currentTime)
        if (key !== activeKeyRef.current) {
          activeKeyRef.current = key
          setActiveKey(key)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  // Keep the active word on screen while narrating.
  useEffect(() => {
    if (!playing || !activeKey) return
    document
      .querySelector(`[data-word="${activeKey}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeKey, playing])

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      audioRef.current?.pause()
    }
  }, [])

  function renderWord(block: LetterBlock, index: number, word: string) {
    const key = `${block.id}:${index}`
    const timing = timingByKey.get(key)
    const timed = timing != null && timing.start !== null

    let className: string | undefined
    if (mode === "listen" && timed) {
      const spoken =
        activeKey != null &&
        (revealOrder.get(key) ?? Number.MAX_SAFE_INTEGER) <=
          (revealOrder.get(activeKey) ?? -1)
      className = cn(
        "transition-all duration-300",
        spoken ? "opacity-100" : "opacity-25",
        key === activeKey && "font-semibold text-[#8f1d1d]"
      )
    }

    return (
      <span key={key} data-word={key} className={className}>
        {word}{" "}
      </span>
    )
  }

  function renderWords(block: LetterBlock, from = 0, to?: number) {
    return block.text
      .split(/\s+/)
      .slice(from, to)
      .map((word, offset) => renderWord(block, from + offset, word))
  }

  if (!opened) {
    return (
      <main className="grid min-h-svh place-items-center px-4">
        <Envelope
          onOpen={() => setOpened(true)}
          sealLetter="E"
          heading="A letter for Gaby"
          hint="Break the seal to read"
        />
      </main>
    )
  }

  const signoff = letterBlocks[letterBlocks.length - 1]
  const signoffWordCount = signoff.text.split(/\s+/).length

  const priorDuration = durations
    .slice(0, trackIndex)
    .reduce((sum, d) => sum + (d || 0), 0)
  const totalDuration = durations.reduce((sum, d) => sum + (d || 0), 0)

  return (
    <main id="top" className="px-4 py-14 sm:py-20">
      <article className="animate-fade-rise mx-auto max-w-2xl rounded-sm bg-[#f7f1e3] px-6 py-12 font-serif text-stone-800 shadow-2xl sm:px-12 sm:py-16">
        <p className="text-center text-xl text-[#8f1d1d]">{"<3"}</p>

        <p className="animate-bounce-soft mt-6 text-center text-xs uppercase tracking-[0.3em] text-stone-400">
          Scroll slowly
        </p>

        {narrationAvailable && mode === "read" && (
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleListen}
              className="border-[#8f1d1d]/50 text-[#8f1d1d] hover:border-[#8f1d1d] hover:bg-[#8f1d1d] hover:text-[#f7f1e3]"
            >
              ▶ Listen — Evan reads this aloud
            </Button>
          </div>
        )}

        {letterBlocks.map((block) => {
          if (block.kind === "greeting") {
            return (
              <Reveal key={block.id} className="mt-10">
                <p className="text-xl italic sm:text-2xl">
                  {renderWords(block)}
                </p>
              </Reveal>
            )
          }

          if (block.kind === "signoff") {
            return (
              <Reveal key={block.id} className="mt-12">
                <p className="text-lg italic text-stone-600">
                  {renderWords(block, 0, signoffWordCount - 1)}
                </p>
                <p className="mt-2 font-hand text-5xl text-stone-800">
                  {renderWords(block, signoffWordCount - 1)}
                </p>
              </Reveal>
            )
          }

          return (
            <Reveal key={block.id} className="mt-8">
              <p
                className={
                  block.id === "p0"
                    ? "text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold first-letter:leading-none first-letter:text-[#8f1d1d] sm:text-xl sm:leading-relaxed"
                    : "text-lg leading-relaxed sm:text-xl sm:leading-relaxed"
                }
              >
                {renderWords(block)}
              </p>
            </Reveal>
          )
        })}
      </article>

      <Reveal className="mt-10 flex justify-center">
        <Button
          asChild
          variant="ghost"
          className="text-stone-400 hover:text-stone-200"
        >
          <a href="#top">Read it again</a>
        </Button>
      </Reveal>

      {mode === "listen" && (
        <ListenPlayer
          audio={audioRef.current}
          playing={playing}
          priorDuration={priorDuration}
          totalDuration={totalDuration}
          onToggle={toggleListen}
          onStop={stopListening}
        />
      )}
    </main>
  )
}
