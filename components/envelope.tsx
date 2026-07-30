"use client"

interface EnvelopeProps {
  onOpen: () => void
  sealLetter: string
  heading: string
  hint: string
}

export function Envelope({ onOpen, sealLetter, heading, hint }: EnvelopeProps) {
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
          onClick={onOpen}
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
    </div>
  )
}
