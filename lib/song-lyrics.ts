export interface LyricLine {
  time: number
  text: string
}

export interface LyricWord {
  time: number
  text: string
}

export const song = {
  videoId: "CGmdlQA_RZ4",
  title: "ABBA - The Winner Takes It All | Epic Orchestra (2020)",
}

export const lyrics: LyricLine[] = []

/** Returns the index of the lyric line active at the given time. */
export function currentLyricIndex(time: number): number {
  let index = 0
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= time) index = i
    else break
  }
  return index
}

/** Build word-level timings by spreading each line's duration evenly across its words. */
function buildWordTimings(): LyricWord[] {
  const words: LyricWord[] = []
  // Pack words into the first 80% of the line window so they finish before
  // the next line starts (most sung lines have a small trailing pause).
  const LINE_FILL_RATIO = 0.8
  // Nudge lyrics slightly earlier to compensate for player/network latency.
  const EARLY_OFFSET = -0.4
  for (let i = 0; i < lyrics.length; i++) {
    const line = lyrics[i]
    const nextLine = lyrics[i + 1]
    const lineEnd = nextLine ? nextLine.time : line.time + 8 // fallback tail
    const lineWords = line.text.split(/\s+/).filter(Boolean)
    const duration = (lineEnd - line.time) * LINE_FILL_RATIO
    lineWords.forEach((word, idx) => {
      words.push({
        time:
          line.time +
          (idx / Math.max(1, lineWords.length)) * duration +
          EARLY_OFFSET,
        text: word,
      })
    })
  }
  return words
}

export const lyricWords = buildWordTimings()

/** Returns the index of the lyric word active at the given time. */
export function currentLyricWordIndex(time: number): number {
  let index = 0
  for (let i = 0; i < lyricWords.length; i++) {
    if (lyricWords[i].time <= time) index = i
    else break
  }
  return index
}

/** Returns all word timings that belong to a given lyric line. */
export function wordsForLine(lineIndex: number): LyricWord[] {
  if (lineIndex < 0 || lineIndex >= lyrics.length) return []
  const line = lyrics[lineIndex]
  const nextLine = lyrics[lineIndex + 1]
  const lineEnd = nextLine ? nextLine.time : line.time + 8
  return lyricWords.filter((w) => w.time >= line.time && w.time < lineEnd)
}

/** Returns the global word index where a given lyric line starts. */
export function wordStartIndexForLine(lineIndex: number): number {
  if (lineIndex <= 0) return 0
  const line = lyrics[lineIndex]
  return lyricWords.findIndex((w) => w.time >= line.time)
}

/** Returns the lyric line index that contains the given word index. */
export function lineIndexForWord(wordIndex: number): number {
  if (wordIndex < 0) return 0
  const time = lyricWords[Math.min(wordIndex, lyricWords.length - 1)]?.time ?? 0
  return currentLyricIndex(time)
}
