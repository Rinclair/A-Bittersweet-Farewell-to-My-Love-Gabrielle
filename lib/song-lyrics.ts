export interface LyricLine {
  time: number
  text: string
}

export const song = {
  videoId: "0d3wxfS4Dtw",
  title: "The Winner Takes It All",
}

export const lyrics: LyricLine[] = [
  { time: 34.8, text: "I don't wanna talk" },
  { time: 38.8, text: "About things we've gone through" },
  { time: 42.7, text: "Though it's hurting me" },
  { time: 46.1, text: "Now it's history" },
  { time: 50.5, text: "I've played all my cards" },
  { time: 54.6, text: "And that's what you've done too" },
  { time: 58.4, text: "Nothing more to say" },
  { time: 62.2, text: "No more ace to play" },
  { time: 65.9, text: "The winner takes it all" },
  { time: 69.9, text: "The loser's standing small" },
  { time: 73.7, text: "Beside the victory" },
  { time: 77.3, text: "That's her destiny" },
  { time: 81.9, text: "I was in your arms" },
  { time: 85.7, text: "Thinking I belonged there" },
  { time: 89.2, text: "I figured it made sense" },
  { time: 93.3, text: "Building me a fence" },
  { time: 96.8, text: "Building me a home" },
  { time: 100.8, text: "Thinking I'd be strong there" },
  { time: 104.7, text: "But I was a fool" },
  { time: 108.0, text: "Playing by the rules" },
  { time: 112.1, text: "The gods may throw the dice" },
  { time: 115.9, text: "Their minds as cold as ice" },
  { time: 119.7, text: "And someone way down here" },
  { time: 123.8, text: "Loses someone dear" },
  { time: 127.3, text: "The winner takes it all" },
  { time: 131.0, text: "The loser has to fall" },
  { time: 134.8, text: "It's simple and it's plain" },
  { time: 138.2, text: "Why should I complain?" },
  { time: 142.3, text: "But tell me does she kiss" },
  { time: 146.4, text: "Like I used to kiss you?" },
  { time: 150.2, text: "Does it feel the same" },
  { time: 153.7, text: "When she calls your name?" },
  { time: 157.7, text: "Somewhere deep inside" },
  { time: 161.4, text: "You must know I miss you" },
  { time: 165.5, text: "But what can I say?" },
  { time: 169.1, text: "Rules must be obeyed" },
  { time: 172.9, text: "The judges will decide" },
  { time: 176.8, text: "The likes of me abide" },
  { time: 180.3, text: "Spectators of the show" },
  { time: 184.4, text: "Always staying low" },
  { time: 188.1, text: "The game is on again" },
  { time: 192.0, text: "A lover or a friend" },
  { time: 195.4, text: "A big thing or a small" },
  { time: 199.2, text: "The winner takes it all" },
  { time: 205.1, text: "I don't wanna talk" },
  { time: 209.2, text: "If it makes you feel sad" },
  { time: 212.8, text: "And I understand" },
  { time: 216.1, text: "You've come to shake my hand" },
  { time: 220.5, text: "I apologize" },
  { time: 224.2, text: "If it makes you feel bad" },
  { time: 228.1, text: "Seeing me so tense" },
  { time: 231.9, text: "No self-confidence" },
  { time: 234.7, text: "But you see" },
  { time: 235.8, text: "The winner takes it all" },
  { time: 243.3, text: "The winner takes it all..." },
  { time: 252.3, text: "So the winner takes it all" },
  { time: 259.9, text: "And the loser has to fall" },
  { time: 267.3, text: "Throw a dice, cold as ice" },
  { time: 274.7, text: "Way down here, someone dear" },
  { time: 282.3, text: "Takes it all, has to fall" },
  { time: 289.8, text: "It seems plain to me" },
]

/** Returns the index of the lyric line active at the given time. */
export function currentLyricIndex(time: number): number {
  let index = 0
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= time) index = i
    else break
  }
  return index
}
