"use client"

import { useEffect, useRef, useState } from "react"

import { useVoiceActivity } from "@/lib/voice-context"
import { cn } from "@/lib/utils"
import archiveData from "@/lib/archive-data.json"

interface ExhibitFile {
  id: string
  name: string
  kind: "image" | "video"
}

interface RecordingFile {
  src: string
  name: string
  kind: "audio"
}

interface ArchiveSet {
  id: string
  name: string
  files: ExhibitFile[]
  recording?: RecordingFile
}

const sets = archiveData.sets as ArchiveSet[]

const thumbUrl = (id: string) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w400`
const fullUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}=w1600`
const videoUrl = (id: string) =>
  `https://drive.google.com/file/d/${id}/preview`

// Deterministic photo tilt so every visitor sees the same desk.
const TILTS = [-2.1, 1.4, -0.8, 2.2, -1.5, 0.9]
const tilt = (index: number) => TILTS[index % TILTS.length]

const fileNo = (index: number) => String(index + 1).padStart(2, "0")

function Stamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rotate-[-8deg] border-[3px] px-3 py-1 font-type text-xs uppercase tracking-[0.3em]",
        className
      )}
    >
      Confidential
    </span>
  )
}

function ExhibitCard({
  file,
  index,
  onOpen,
}: {
  file: ExhibitFile
  index: number
  onOpen: () => void
}) {
  const [failed, setFailed] = useState(false)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative block bg-[#fdfaf2] p-2 pb-5 shadow-md transition-transform duration-300 hover:z-10 hover:scale-[1.04]"
      style={{ transform: `rotate(${tilt(index)}deg)` }}
      aria-label={`Open exhibit ${fileNo(index)}`}
    >
      {failed ? (
        <div className="flex aspect-square w-full items-center justify-center bg-[#2a2419] font-type text-xs uppercase tracking-widest text-stone-400">
          {file.kind === "video" ? "▶ video" : "no preview"}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbUrl(file.id)}
          alt={file.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="aspect-square w-full object-cover sepia-[0.25]"
        />
      )}
      {file.kind === "video" && (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white">
          ▶
        </span>
      )}
      <p className="mt-2 text-center font-type text-[10px] uppercase tracking-[0.2em] text-stone-500">
        Exhibit {fileNo(index)}
      </p>
    </button>
  )
}

function FolderBook({
  set,
  setIndex,
  onClose,
}: {
  set: ArchiveSet
  setIndex: number
  onClose: () => void
}) {
  const [coverOpen, setCoverOpen] = useState(false)
  const [viewer, setViewer] = useState<ExhibitFile | null>(null)
  const { start, end } = useVoiceActivity()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Swing the cover open just after mount, and lock page scroll meanwhile.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setCoverOpen(true))
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (viewer) setViewer(null)
      else onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [viewer, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={set.name}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full max-w-5xl [perspective:1600px]">
        {/* interior of the folder */}
        <div className="paper-old max-h-[85vh] overflow-y-auto rounded-sm p-8 sm:p-12">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close file"
            className="absolute right-4 top-4 z-10 text-xl text-stone-500 transition-colors hover:text-stone-800"
          >
            ✕
          </button>

          <Stamp className="absolute right-10 top-8 border-[#8f1d1d]/60 text-[#8f1d1d]/80" />

          <p className="font-type text-[10px] uppercase tracking-[0.3em] text-[#6d5222]">
            File No. {fileNo(setIndex)}
          </p>
          <h3 className="mt-1 font-type text-lg uppercase tracking-[0.15em] text-[#3d2f14] sm:text-xl">
            {set.name}
          </h3>
          <p className="mt-1 font-type text-[10px] uppercase tracking-[0.25em] text-[#6d5222]">
            {set.files.length} exhibits recovered
          </p>

          {set.recording && (
            <div className="mt-6 rounded-md border border-[#8f1d1d]/20 bg-[#fdfaf2] p-3 shadow-sm">
              <p className="font-type text-[10px] uppercase tracking-[0.25em] text-[#6d5222]">
                Playing recording
              </p>
              <audio
                ref={audioRef}
                src={set.recording.src}
                autoPlay
                className="hidden"
                aria-label={set.recording.name}
                onPlay={start}
                onPause={end}
                onEnded={end}
              />
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {set.files.map((file, index) => (
              <ExhibitCard
                key={file.id}
                file={file}
                index={index}
                onOpen={() => setViewer(file)}
              />
            ))}
          </div>
        </div>

        {/* folder cover, hinged on the left edge */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm bg-gradient-to-br from-[#dfc08a] to-[#c8a263] shadow-2xl transition-transform duration-700 ease-in-out [transform-origin:left_center]",
            coverOpen
              ? "pointer-events-none [transform:rotateY(-160deg)]"
              : "[transform:rotateY(0deg)]"
          )}
        >
          <p className="font-type text-xs uppercase tracking-[0.35em] text-[#6d5222]">
            File No. {fileNo(setIndex)}
          </p>
          <p className="px-6 text-center font-type text-xl uppercase tracking-[0.15em] text-[#3d2f14] sm:text-2xl">
            {set.name}
          </p>
          <Stamp className="mt-2 border-[#8f1d1d]/50 text-[#8f1d1d]/70" />
        </div>
      </div>

      {/* exhibit viewer */}
      {viewer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85"
            onClick={() => setViewer(null)}
          />
          {viewer.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fullUrl(viewer.id)}
              alt={viewer.name}
              className="relative max-h-[85vh] max-w-full object-contain shadow-2xl"
            />
          ) : (
            <iframe
              src={videoUrl(viewer.id)}
              title={viewer.name}
              className="relative aspect-video w-full max-w-3xl bg-black"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}
          <button
            type="button"
            onClick={() => setViewer(null)}
            aria-label="Close exhibit"
            className="absolute right-4 top-4 text-2xl text-stone-300 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export function ArchiveSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section aria-label="Case files" className="mx-auto mt-16 max-w-5xl">
      <div className="text-center">
        <p className="font-type text-[10px] uppercase tracking-[0.4em] text-[#d9c9a3]/60">
          Recovered evidence
        </p>
        <h2 className="mt-2 font-type text-2xl uppercase tracking-[0.3em] text-[#e8dcc0] sm:text-3xl">
          The Case Files
        </h2>
        <Stamp className="mt-4 border-[#e06666]/60 text-[#e06666]" />
        <p className="mt-4 font-type text-xs uppercase tracking-[0.25em] text-[#d9c9a3]/60">
          Choose a file to open
        </p>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set, index) => (
          <button
            key={set.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group text-left"
            aria-label={`Open file: ${set.name}`}
          >
            <div className="h-4 w-36 rounded-t-md bg-[#c9a86a] shadow-sm" />
            <div className="rounded-md rounded-tl-none bg-gradient-to-br from-[#dfc08a] to-[#c8a263] p-7 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-0.5deg]">
              <p className="font-type text-xs uppercase tracking-[0.3em] text-[#6d5222]">
                File No. {fileNo(index)}
              </p>
              <p className="mt-3 font-type text-base uppercase tracking-[0.1em] text-[#3d2f14]">
                {set.name}
              </p>
              <p className="mt-5 font-type text-xs uppercase tracking-[0.25em] text-[#6d5222]">
                {set.files.length} exhibits · open ›
              </p>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <FolderBook
          set={sets[openIndex]}
          setIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  )
}
