import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NavItem } from '../content'

type Props = {
  items: NavItem[]
  activeId: string
  onSelect: (id: string) => void
  onBookDemo: () => void
  progress: number
  signInHref: string
}

/**
 * Floating segmented-control pill nav.
 *
 * Target priority for the sliding capsule:
 *   1. `hoveredId` — cursor is over a tab (pill follows cursor)
 *   2. `pendingId` — user just clicked but the scroll hasn't landed yet
 *   3. `activeId`  — section-driven default
 *
 * `pendingId` is why clicking a tab you're already hovering doesn't replay
 * the animation: without it, the pill would jump back to the previous
 * `activeId` the moment hover cleared, then slide forward again when the
 * scroll completed.
 */
export function LandingNav({
  items,
  activeId,
  onSelect,
  onBookDemo,
  progress,
  signInHref,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [pill, setPill] = useState<{ x: number; w: number; ready: boolean }>({
    x: 0,
    w: 0,
    ready: false,
  })

  // Clear the pending lock once the section-driven active id catches up.
  useEffect(() => {
    if (pendingId && activeId === pendingId) setPendingId(null)
  }, [activeId, pendingId])

  const targetId = hoveredId ?? pendingId ?? activeId

  const measurePill = useCallback(() => {
    const btn = tabRefs.current.get(targetId)
    const container = containerRef.current
    if (!btn || !container) return

    const cRect = container.getBoundingClientRect()
    const bRect = btn.getBoundingClientRect()
    setPill((prev) => ({
      x: bRect.left - cRect.left + container.scrollLeft - 5,
      w: bRect.width,
      ready: prev.ready || targetId === activeId,
    }))
  }, [activeId, targetId])

  useLayoutEffect(() => {
    measurePill()
  }, [items, measurePill])

  useEffect(() => {
    const container = containerRef.current
    window.addEventListener('resize', measurePill)
    const ro = new ResizeObserver(measurePill)
    if (container) ro.observe(container)
    container?.addEventListener('scroll', measurePill, { passive: true })
    return () => {
      window.removeEventListener('resize', measurePill)
      container?.removeEventListener('scroll', measurePill)
      ro.disconnect()
    }
  }, [measurePill, targetId])

  useEffect(() => {
    const btn = tabRefs.current.get(targetId)
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [targetId])

  return (
    <nav className="lp-topbar" aria-label="Primary">
      <div className="lp-topbar-side lp-topbar-side-left">
        <Link to="/" className="lp-nav-brand" aria-label="Nodestra home">
          <img
            className="lp-nav-brand-mark"
            src="/assets/nodestra-mark.svg"
            alt=""
            aria-hidden="true"
          />
          <span className="lp-nav-brand-wordmark">
            nodestra<span className="lp-nav-brand-period">.</span>
          </span>
        </Link>
      </div>

      <div
        ref={containerRef}
        className="lp-pill"
        role="tablist"
        aria-label="Section navigation"
        onMouseLeave={() => setHoveredId(null)}
      >
        <span
          className="lp-pill-indicator"
          aria-hidden="true"
          style={{
            opacity: pill.ready ? 1 : 0,
            transform: `translateX(${pill.x}px)`,
            width: `${pill.w}px`,
          }}
        >
          <span
            className="lp-pill-progress"
            style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }}
          />
        </span>

        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              ref={(el) => {
                if (el) tabRefs.current.set(item.id, el)
                else tabRefs.current.delete(item.id)
              }}
              className={`lp-pill-tab ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => {
                setPendingId(item.id)
                onSelect(item.id)
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="lp-topbar-side lp-topbar-side-right">
        <a href={signInHref} target="_blank" rel="noopener noreferrer" className="lp-nav-link">
          Sign in
        </a>
        <button type="button" className="lp-btn lp-btn-primary" onClick={onBookDemo}>
          Book demo
        </button>
      </div>
    </nav>
  )
}
