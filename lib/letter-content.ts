export interface LetterBlock {
  id: string
  kind: "greeting" | "paragraph" | "signoff"
  text: string
}

export const letterBlocks: LetterBlock[] = [
  {
    id: "greeting",
    kind: "greeting",
    text: "Hii bee bee,",
  },
  {
    id: "p0",
    kind: "paragraph",
    text: "Congratulations on finishing your orientation! I'm sure it was tough and tiring, but it wasn't that bad right? (Hehehe), listen, you have no idea how glad I am seeing you make so many friends, and truth be told, I can't wait for you to experience this university life, the life that you have always wanted.",
  },
  {
    id: "p1",
    kind: "paragraph",
    text: "And with that, comes a new journey, a journey in which you will experience new happiness, anger, fear, disgust, and sadness, a journey in which you will partake in countless adventures, mysteries, dramas, and fantasies. And surely, it'll be these journeys that will shape your soul into that which is new, and turn you into a more precious gem than what I could ever imagine.",
  },
  {
    id: "p2",
    kind: "paragraph",
    text: "I hope that what I have done in these past few months have helped you reach this university of dreams. Now that you have stepped both feet inside its grounds, my role as your friend, your escort, and your guard, has finally ended. The comfort I was meant to provide would soon reach its limits for it is not long until I no longer have the ability to understand your troubles, but the companions and the friends around you that will.",
  },
  {
    id: "p3",
    kind: "paragraph",
    text: "You have been my sunshine, my ray of light, and the Tohru to my Kyo, but now is also the right time to steer the shining glimmer of hope you so selflessly give me, to the new lucky individual in your heart. Soon, you will await the morning response, the afternoon news, and the evening calls of another. The soothing words you seek will no longer be mine to give, and, with that, my role as your partner has also finally ended and it is therefore time for me to leave.",
  },
  {
    id: "p4",
    kind: "paragraph",
    text: "Thank you, my sweet Gaby, for all the memories that you've given me. Thank you for the endless surprises, kisses, and hugs you shower me with. Thank you for the eternally endearing words you have healed my heart with. Thank you for being my player two in the online adventures we took on. Thank you for staying and pushing for our love, a battle I shall never forget. Most importantly, thank you for placing your warm love on me and thank you for letting me place mine on you.",
  },
  {
    id: "p5",
    kind: "paragraph",
    text: "The people you'll meet will fill the gaps that I never could, and it is my sole wish to see you be the Gabrielle you've always meant to become. For all of today, all of tomorrow, and all of the days that awaits you, there will never be a single day my wishes of your happiness will ever fade.",
  },
  {
    id: "p6",
    kind: "paragraph",
    text: "May the world treat you with the same kindness, warmth, and grace you brought into my life. Go shine as bright as you were always destined to, Gaby.",
  },
  {
    id: "signoff",
    kind: "signoff",
    text: "The star in the distant sky, Evan",
  },
]
