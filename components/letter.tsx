"use client"

import { useEffect, useRef, useState } from "react"

import { ArchiveSection } from "@/components/archive"
import { Envelope } from "@/components/envelope"
import { FountainPenDecoration, InkBottleDecoration } from "@/components/letter-decorations"
import { ListenPlayer } from "@/components/listen-player"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { letterBlocks, type LetterBlock } from "@/lib/letter-content"
import { narration, narrationAvailable, timingByKey } from "@/lib/narration"
import { cn } from "@/lib/utils"

// Words start fading in this many seconds before they are spoken.
const REVEAL_LEAD_SECONDS = 0.35

const MIN_ZOOM = 0.8
const MAX_ZOOM = 2
const ZOOM_STEP = 0.1

// Deterministic PRNG so server and client render the identical ragged edge.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A torn-paper silhouette: fine fiber tears along each edge, with the
// occasional deeper chip gouged out.
function raggedClipPath(seed: number, steps = 34): string {
  const rnd = mulberry32(seed)
  const px = () => {
    const chip = rnd() < 0.12
    const v = chip ? 8 + rnd() * 10 : 1 + rnd() * 4
    return v.toFixed(1)
  }
  const pts: string[] = []
  for (let i = 0; i <= steps; i++)
    pts.push(`${((i / steps) * 100).toFixed(2)}% ${px()}px`)
  for (let i = 1; i <= steps; i++)
    pts.push(`calc(100% - ${px()}px) ${((i / steps) * 100).toFixed(2)}%`)
  for (let i = steps - 1; i >= 0; i--)
    pts.push(`${((i / steps) * 100).toFixed(2)}% calc(100% - ${px()}px)`)
  for (let i = steps - 1; i >= 1; i--)
    pts.push(`${px()}px ${((i / steps) * 100).toFixed(2)}%`)
  return `polygon(${pts.join(", ")})`
}

const PAPER_CLIP = raggedClipPath(7)

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

function lastWordStartedAt(track: number, t: number): string | null {
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
  const [revealKey, setRevealKey] = useState<string | null>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [durations, setDurations] = useState<number[]>([])
  const [zoom, setZoom] = useState(1)
  const [elapsed, setElapsed] = useState("")

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const trackRef = useRef(0)
  const durationsRef = useRef<number[]>([])
  const activeKeyRef = useRef<string | null>(null)
  const revealKeyRef = useRef<string | null>(null)
  const playingRef = useRef(false)
  const rafRef = useRef(0)
  const hasAutoStartedRef = useRef(false)

  function stopListening() {
    audioRef.current?.pause()
    playingRef.current = false
    setPlaying(false)
    setMode("read")
    activeKeyRef.current = null
    setActiveKey(null)
    revealKeyRef.current = null
    setRevealKey(null)
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

  // Track the spoken word (auto-scroll anchor) and lead-revealed word.
  useEffect(() => {
    if (!playing) return
    const tick = () => {
      const audio = audioRef.current
      if (audio) {
        const t = audio.currentTime
        const nextActive = lastWordStartedAt(trackRef.current, t)
        if (nextActive !== activeKeyRef.current) {
          activeKeyRef.current = nextActive
          setActiveKey(nextActive)
        }
        const nextReveal = lastWordStartedAt(
          trackRef.current,
          t + REVEAL_LEAD_SECONDS
        )
        if (nextReveal !== revealKeyRef.current) {
          revealKeyRef.current = nextReveal
          setRevealKey(nextReveal)
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

  // Start narrating automatically the moment the letter is opened.
  useEffect(() => {
    if (!opened || !narrationAvailable || hasAutoStartedRef.current) return
    const id = setTimeout(() => {
      hasAutoStartedRef.current = true
      toggleListen()
    }, 900)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  // Count how much time has passed since the letter was given.
  // Hard-coded moment: Friday, July 31st 2026 at 07:00 Jakarta time (WIB, UTC+7).
  const GIVEN_AT_WIB = "2026-07-31T07:00:00+07:00"
  useEffect(() => {
    function updateElapsed() {
      const givenAt = new Date(GIVEN_AT_WIB)
      const now = new Date()
      const diffMs = now.getTime() - givenAt.getTime()
      if (diffMs < 0) {
        setElapsed("Not given yet")
        return
      }
      const totalMinutes = Math.floor(diffMs / 60_000)
      const days = Math.floor(totalMinutes / 1440)
      const hours = Math.floor((totalMinutes % 1440) / 60)
      const minutes = totalMinutes % 60
      setElapsed(
        `${String(days).padStart(3, "0")} days ${String(hours).padStart(2, "0")} hours ${String(minutes).padStart(2, "0")} minutes`
      )
    }
    updateElapsed()
    const id = setInterval(updateElapsed, 60_000)
    return () => clearInterval(id)
  }, [])

  function renderWord(block: LetterBlock, index: number, word: string) {
    const key = `${block.id}:${index}`
    const timing = timingByKey.get(key)
    const timed = timing != null && timing.start !== null

    let className: string | undefined
    if (mode === "listen" && timed) {
      const revealed =
        revealKey != null &&
        (revealOrder.get(key) ?? Number.MAX_SAFE_INTEGER) <=
          (revealOrder.get(revealKey) ?? -1)
      className = cn(
        "transition-opacity duration-300",
        revealed ? "opacity-100" : "opacity-0"
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
    <main id="top" className="relative px-4 py-14 sm:py-20">
      <InkBottleDecoration className="pointer-events-none absolute left-2 top-40 z-10 w-20 drop-shadow-xl sm:left-8 sm:top-48 sm:w-32" />
      <FountainPenDecoration className="pointer-events-none absolute right-0 top-36 z-10 w-14 drop-shadow-xl sm:right-6 sm:top-44 sm:w-24" />

      <div
        className="animate-fade-rise mx-auto w-[92vw] rotate-[-0.4deg] drop-shadow-2xl sm:w-[80vw]"
        style={{ zoom } as React.CSSProperties}
      >
        <article
          className="paper-old px-10 py-16 font-serif text-[#26314e] sm:px-20 sm:py-24"
          style={{ clipPath: PAPER_CLIP }}
        >
          <div className="text-right">
            <p className="font-sans text-sm font-semibold tracking-wide text-[#8f1d1d] sm:text-base">
              Friday, July 31st 2026
            </p>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8f1d1d]/80">
              {elapsed}
            </p>
          </div>

          {narrationAvailable && mode === "read" && (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleListen}
                className="border-[#8f1d1d]/50 font-sans text-[#8f1d1d] hover:border-[#8f1d1d] hover:bg-[#8f1d1d] hover:text-[#f7f1e3]"
              >
                ▶ Listen — Evan reads this aloud
              </Button>
            </div>
          )}

          {letterBlocks.map((block) => {
            if (block.kind === "greeting") {
              return (
                <Reveal key={block.id} className="mt-10">
                  <p className="text-3xl sm:text-4xl">{renderWords(block)}</p>
                </Reveal>
              )
            }

            if (block.kind === "signoff") {
              return (
                <Reveal key={block.id} className="mt-12">
                  <p className="text-2xl text-[#4a5570] sm:text-3xl">
                    {renderWords(block, 0, signoffWordCount - 1)}
                  </p>
                  <p className="mt-2 font-hand text-7xl text-[#26314e]">
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
                      ? "text-2xl leading-loose first-letter:float-left first-letter:mr-3 first-letter:text-8xl first-letter:leading-none first-letter:text-[#8f1d1d] sm:text-3xl sm:leading-loose"
                      : "text-2xl leading-loose sm:text-3xl sm:leading-loose"
                  }
                >
                  {renderWords(block)}
                </p>
              </Reveal>
            )
          })}
        </article>
      </div>

      <Reveal className="mt-16">
        <ArchiveSection />
      </Reveal>

      <Reveal className="mt-10 flex justify-center">
        <Button
          asChild
          variant="ghost"
          className="text-stone-400 hover:text-stone-200"
        >
          <a href="#top">Read it again</a>
        </Button>
      </Reveal>

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 rounded-full bg-[#f1e5c6] px-2 py-1.5 text-stone-700 shadow-xl ring-1 ring-black/10">
        <Button
          type="button"
          variant="ghost"
          aria-label="Zoom out"
          disabled={zoom <= MIN_ZOOM}
          onClick={() =>
            setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))
          }
          className="h-7 w-7 rounded-full p-0 text-base"
        >
          −
        </Button>
        <span className="w-11 text-center font-sans text-xs tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          type="button"
          variant="ghost"
          aria-label="Zoom in"
          disabled={zoom >= MAX_ZOOM}
          onClick={() =>
            setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))
          }
          className="h-7 w-7 rounded-full p-0 text-base"
        >
          +
        </Button>
      </div>

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
