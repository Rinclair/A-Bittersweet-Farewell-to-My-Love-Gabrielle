"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

interface VoiceContextValue {
  active: boolean
  start: () => void
  end: () => void
}

const VoiceContext = createContext<VoiceContextValue>({
  active: false,
  start: () => {},
  end: () => {},
})

export function VoiceActivityProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
  const start = useCallback(() => setCount((c) => c + 1), [])
  const end = useCallback(() => setCount((c) => Math.max(0, c - 1)), [])
  const value = useMemo(
    () => ({ active: count > 0, start, end }),
    [count, start, end]
  )
  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
}

export function useVoiceActivity() {
  return useContext(VoiceContext)
}
