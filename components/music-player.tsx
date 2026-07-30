"use client"

import { useEffect, useRef, useState } from "react"

import { song } from "@/lib/song-lyrics"

const YT_SCRIPT_ID = "youtube-iframe-api"

// YouTube API types are loaded globally by the script.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const YT: any

interface MusicPlayerProps {
  /** When true, the music volume is lowered so voice audio can be heard. */
  duck?: boolean
  /** Called on each tick with the current playback time in seconds. */
  onTimeUpdate?: (time: number) => void
  /** Called when play/pause state changes. */
  onPlayingChange?: (playing: boolean) => void
}

export function MusicPlayer({
  duck = false,
  onTimeUpdate,
  onPlayingChange,
}: MusicPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const rafRef = useRef<number>(0)
  const [ready, setReady] = useState(false)

  // Load the YouTube IFrame API and create the player.
  useEffect(() => {
    if (typeof document === "undefined") return

    function createPlayer() {
      if (!containerRef.current || playerRef.current) return
      playerRef.current = new YT.Player(containerRef.current, {
        videoId: song.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => {
            setReady(true)
            try {
              playerRef.current?.playVideo()
              playerRef.current?.setVolume(50)
            } catch {
              // ignore
            }
          },
          onStateChange: (event: { data: number }) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2
            onPlayingChange?.(event.data === 1)
          },
        },
      })
    }

    if (typeof YT === "undefined" || !YT.Player) {
      if (!document.getElementById(YT_SCRIPT_ID)) {
        const tag = document.createElement("script")
        tag.id = YT_SCRIPT_ID
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScript = document.getElementsByTagName("script")[0]
        firstScript.parentNode?.insertBefore(tag, firstScript)
      }
      ;(window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady =
        createPlayer
    } else {
      createPlayer()
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      try {
        playerRef.current?.destroy()
      } catch {
        // ignore
      }
      playerRef.current = null
    }
  }, [onPlayingChange])

  // Poll current time while playing.
  useEffect(() => {
    if (!ready) return
    let lastTime = -1
    const tick = () => {
      try {
        const t = playerRef.current?.getCurrentTime?.() ?? 0
        if (Math.abs(t - lastTime) > 0.05) {
          lastTime = t
          onTimeUpdate?.(t)
        }
      } catch {
        // ignore
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [ready, onTimeUpdate])

  // Duck the music when voice audio is playing.
  useEffect(() => {
    if (!ready) return
    try {
      playerRef.current?.setVolume(duck ? 3 : 50)
    } catch {
      // ignore
    }
  }, [duck, ready])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
