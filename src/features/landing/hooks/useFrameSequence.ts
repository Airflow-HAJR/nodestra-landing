import { useEffect, useRef, useState } from 'react'

type UseFrameSequenceArgs = {
  totalFrames: number
  reducedMotion: boolean
  mobileMode: boolean
  buildUrl: (frame: number) => string
  /** Number of strategic "pilot" frames to load first for a responsive feel. */
  pilotCount?: number
}

type FrameSequenceState = {
  images: HTMLImageElement[]
  loaded: number
  /** True once the poster (frame 0) is drawable. */
  posterReady: boolean
  /** True once a pilot set of evenly-spaced frames is loadable (good enough to start). */
  pilotReady: boolean
  /** True once every frame is resident. */
  fullyLoaded: boolean
}

/**
 * Poster-first frame loader for the hero scrubbing animation.
 *
 * - Loads frame 0 first (the poster) so CTAs and hero can render immediately.
 * - If reduced motion or mobile, stops after the poster and a few pilot frames.
 * - Otherwise lazily fills in the rest so the scrubbing is smooth when the
 *   user actually starts scrolling.
 */
export function useFrameSequence({
  totalFrames,
  reducedMotion,
  mobileMode,
  buildUrl,
  pilotCount = 12,
}: UseFrameSequenceArgs): FrameSequenceState {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(0)
  const [posterReady, setPosterReady] = useState(false)
  const [pilotReady, setPilotReady] = useState(false)
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false
    const imgs: HTMLImageElement[] = new Array(totalFrames)
    const loadedFlags: boolean[] = new Array(totalFrames).fill(false)
    let loadedCount = 0
    let pilotLoaded = 0

    setImages(imgs)
    setLoaded(0)
    setPosterReady(false)
    setPilotReady(false)

    const pilotIndices = new Set<number>([0])
    if (!reducedMotion) {
      const pilots = Math.min(pilotCount, totalFrames)
      for (let i = 1; i < pilots; i++) {
        pilotIndices.add(Math.floor((i * totalFrames) / pilots))
      }
    }

    function loadOne(i: number, onDone?: () => void) {
      if (cancelled.current) return
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = buildUrl(i)
      img.onload = () => {
        if (cancelled.current) return
        if (loadedFlags[i]) return
        loadedFlags[i] = true
        loadedCount++
        setLoaded(loadedCount)
        if (i === 0) setPosterReady(true)
        if (pilotIndices.has(i)) {
          pilotLoaded++
          if (pilotLoaded >= pilotIndices.size) setPilotReady(true)
        }
        onDone?.()
      }
      img.onerror = () => {
        if (cancelled.current) return
        if (loadedFlags[i]) return
        loadedFlags[i] = true
        loadedCount++
        setLoaded(loadedCount)
        onDone?.()
      }
      imgs[i] = img
    }

    // Tier 1: poster.
    loadOne(0, () => {
      if (cancelled.current) return

      // Tier 2: pilot frames (evenly spaced).
      const pilotList = Array.from(pilotIndices).filter((i) => i !== 0)
      pilotList.forEach((i) => loadOne(i))

      // If reduced motion or mobile — stop here. Poster is the experience.
      if (reducedMotion || mobileMode) return

      // Tier 3: fill remaining frames in idle time, prioritising frames close
      // to what's already loaded (neighbour-first) for smoother scrub.
      const remaining: number[] = []
      for (let i = 1; i < totalFrames; i++) {
        if (!pilotIndices.has(i)) remaining.push(i)
      }

      const schedule =
        typeof window !== 'undefined' && 'requestIdleCallback' in window
          ? (cb: () => void) =>
              (window as unknown as {
                requestIdleCallback: (cb: () => void) => number
              }).requestIdleCallback(cb)
          : (cb: () => void) => window.setTimeout(cb, 16)

      const BATCH = 8
      let cursor = 0
      const pump = () => {
        if (cancelled.current) return
        for (let b = 0; b < BATCH && cursor < remaining.length; b++, cursor++) {
          loadOne(remaining[cursor])
        }
        if (cursor < remaining.length) schedule(pump)
      }
      schedule(pump)
    })

    return () => {
      cancelled.current = true
    }
  }, [totalFrames, reducedMotion, mobileMode, buildUrl, pilotCount])

  return {
    images,
    loaded,
    posterReady,
    pilotReady,
    fullyLoaded: loaded >= totalFrames,
  }
}
