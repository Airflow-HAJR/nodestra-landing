import { useCallback, useEffect, useRef } from 'react'

type FrameSequenceCanvasProps = {
  images: HTMLImageElement[]
  totalFrames: number
  /** 0..1 overall progress through the scroll story. */
  progress: number
  posterReady: boolean
  /** When true, we skip scrubbing and only ever draw the poster. */
  disableScrub: boolean
}

/**
 * Fixed full-viewport canvas that draws the airport frame sequence.
 * Does NOT own its own ScrollTrigger — progress is driven from the parent
 * via the scroll-story hook so hero pinning + chapter state can share state.
 */
export function FrameSequenceCanvas({
  images,
  totalFrames,
  progress,
  posterReady,
  disableScrub,
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrame = useRef(-1)

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current
      const img = images[frameIndex]
      if (!canvas || !img || !img.complete || !img.naturalWidth) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const vw = window.innerWidth
      const vh = window.innerHeight

      if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
        canvas.width = vw * dpr
        canvas.height = vh * dpr
        canvas.style.width = `${vw}px`
        canvas.style.height = `${vh}px`
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, vw, vh)

      const imgRatio = img.naturalWidth / img.naturalHeight
      const viewRatio = vw / vh
      let dW: number, dH: number, dX: number, dY: number
      if (imgRatio > viewRatio) {
        dH = vh
        dW = vh * imgRatio
        dX = (vw - dW) / 2
        dY = 0
      } else {
        dW = vw
        dH = vw / imgRatio
        dX = 0
        dY = (vh - dH) / 2
      }
      ctx.drawImage(img, dX, dY, dW, dH)
      lastFrame.current = frameIndex
    },
    [images],
  )

  // Redraw poster when ready.
  useEffect(() => {
    if (posterReady) drawFrame(0)
  }, [posterReady, drawFrame])

  // Redraw on resize.
  useEffect(() => {
    const onResize = () => drawFrame(lastFrame.current >= 0 ? lastFrame.current : 0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawFrame])

  // Scrub with progress. We pick the nearest loaded frame so partial loads
  // still look fluid instead of popping back to the poster.
  useEffect(() => {
    if (!posterReady) return
    const target = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(progress * (totalFrames - 1))),
    )
    const frame = disableScrub ? 0 : nearestLoadedFrame(images, target)
    if (frame !== lastFrame.current) drawFrame(frame)
  }, [progress, totalFrames, disableScrub, images, posterReady, drawFrame])

  return <canvas ref={canvasRef} className="lp-canvas" aria-hidden="true" />
}

function nearestLoadedFrame(images: HTMLImageElement[], target: number): number {
  const len = images.length
  if (images[target]?.complete && images[target]?.naturalWidth) return target
  for (let offset = 1; offset < len; offset++) {
    const lo = target - offset
    const hi = target + offset
    if (lo >= 0 && images[lo]?.complete && images[lo]?.naturalWidth) return lo
    if (hi < len && images[hi]?.complete && images[hi]?.naturalWidth) return hi
  }
  return 0
}
