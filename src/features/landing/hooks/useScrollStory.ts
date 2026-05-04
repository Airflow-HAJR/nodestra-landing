import { useEffect, useRef, useState } from 'react'

type UseScrollStoryArgs = {
  chapterIds: string[]
  onChapterChange?: (id: string) => void
}

type ScrollStoryState = {
  activeChapter: string
  progress: number
  setActive: (id: string) => void
}

/**
 * Observes chapter sections and tracks the active one + overall page progress.
 * Caller is responsible for assigning `id={chapterId}` to each chapter section root.
 */
export function useScrollStory({ chapterIds, onChapterChange }: UseScrollStoryArgs): ScrollStoryState {
  const [activeChapter, setActiveChapter] = useState(chapterIds[0] ?? '')
  const [progress, setProgress] = useState(0)
  const lastReported = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!chapterIds.length) return

    const elements = chapterIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (!elements.length) return

    const reportActive = (id: string) => {
      if (id === lastReported.current) return
      lastReported.current = id
      setActiveChapter(id)
      onChapterChange?.(id)
    }

    const measureActive = () => {
      const viewportCentre = window.innerHeight * 0.46
      let best: { id: string; distance: number } | null = null

      for (const element of elements) {
        const rect = element.getBoundingClientRect()
        const centre = rect.top + rect.height / 2
        const distance = Math.abs(centre - viewportCentre)
        if (!best || distance < best.distance) {
          best = { id: element.id, distance }
        }
      }

      if (best) reportActive(best.id)
    }

    // Observer keeps section state in sync when visibility changes abruptly,
    // while scroll/resize measurement handles the in-between positions.
    const observer = new IntersectionObserver(
      () => measureActive(),
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -20% 0px' },
    )

    elements.forEach((el) => observer.observe(el))

    // One cheap rAF loop handles both progress and the active section.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        measureActive()
        const doc = document.documentElement
        const scrollable = doc.scrollHeight - window.innerHeight
        const pct = scrollable > 0 ? window.scrollY / scrollable : 0
        setProgress(Math.min(1, Math.max(0, pct)))
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [chapterIds, onChapterChange])

  const setActive = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return { activeChapter, progress, setActive }
}
