"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

interface EnvelopeProps {
  onOpen: () => void
  sealLetter: string
  heading: string
  hint: string
  question?: string
  answers?: string[]
}

function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

export function Envelope({
  onOpen,
  sealLetter,
  heading,
  hint,
  question,
  answers = [],
}: EnvelopeProps) {
  const [asking, setAsking] = useState(false)
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)

  const requiresAuth = question && answers.length > 0

  function handleSealClick() {
    if (requiresAuth) {
      setAsking(true)
      setValue("")
      setError(false)
      return
    }
    onOpen()
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const normalized = normalizeAnswer(value)
    if (answers.map(normalizeAnswer).includes(normalized)) {
      setAsking(false)
      onOpen()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
        {heading}
      </p>

      <div className="animate-float-slow relative aspect-[8/5] w-[320px] sm:w-[400px]">
        {/* envelope back */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#e9ddc0] to-[#d8c8a4] shadow-2xl" />
        {/* side folds */}
        <div className="absolute inset-0 rounded-lg bg-[#dccdaa] [clip-path:polygon(0_0,55%_50%,0_100%)]" />
        <div className="absolute inset-0 rounded-lg bg-[#dccdaa] [clip-path:polygon(100%_0,45%_50%,100%_100%)]" />
        {/* bottom fold */}
        <div className="absolute inset-0 rounded-lg bg-[#e6d9ba] [clip-path:polygon(0_100%,50%_45%,100%_100%)]" />
        {/* top flap */}
        <div className="absolute inset-x-0 top-0 h-[55%] rounded-t-lg bg-[#d3c19a] shadow-md [clip-path:polygon(0_0,100%_0,50%_100%)]" />

        {/* wax seal */}
        <button
          type="button"
          onClick={handleSealClick}
          aria-label="Open the letter"
          className="group absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:2.5s]" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a12323] to-[#6d1414] font-serif text-2xl text-[#f5e6e6] shadow-lg ring-1 ring-black/30 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5e6e6]/30">
              {sealLetter}
            </span>
          </span>
        </button>
      </div>

      <p className="text-sm text-stone-500">{hint}</p>

      {/* question gate */}
      {asking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setAsking(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-sm rounded-lg bg-[#f7f1e3] p-6 shadow-2xl"
          >
            <p className="text-center font-serif text-lg text-[#26314e]">
              {question}
            </p>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
              autoFocus
              placeholder="Type your answer"
              className="mt-4 w-full rounded-md border border-[#8f1d1d]/30 bg-[#fdfaf2] px-3 py-2 text-center font-serif text-[#26314e] placeholder:text-stone-400 focus:border-[#8f1d1d] focus:outline-none focus:ring-1 focus:ring-[#8f1d1d]"
            />
            {error && (
              <p className="mt-2 text-center text-xs text-[#8f1d1d]">
                That doesn&apos;t look right. Try again.
              </p>
            )}
            <Button
              type="submit"
              className="mt-4 w-full bg-[#8f1d1d] text-[#f7f1e3] hover:bg-[#6d1414]"
            >
              Open the letter
            </Button>
            <button
              type="button"
              onClick={() => setAsking(false)}
              className="mt-2 w-full text-center text-xs text-stone-500 hover:text-stone-700"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
