import timingsJson from "./narration-timings.json"

export interface TimedWord {
  w: string
  start: number | null
  end: number | null
  track: number | null
}

export interface NarrationTimings {
  tracks: string[]
  blocks: Record<string, TimedWord[]>
}

export const narration = timingsJson as NarrationTimings

export const narrationAvailable =
  Object.values(narration.blocks).some((words) =>
    words.some((word) => word.start !== null)
  )

/** Flat lookup: "blockId:index" -> timing entry */
export const timingByKey = new Map<string, TimedWord>(
  Object.entries(narration.blocks).flatMap(([blockId, words]) =>
    words.map((word, index) => [`${blockId}:${index}`, word] as const)
  )
)
