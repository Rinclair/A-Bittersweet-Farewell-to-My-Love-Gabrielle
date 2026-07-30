"use client"

import { VoiceActivityProvider } from "@/lib/voice-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return <VoiceActivityProvider>{children}</VoiceActivityProvider>
}
