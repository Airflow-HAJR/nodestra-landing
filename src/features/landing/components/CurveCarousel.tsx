import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

export type CurveCarouselItem = {
  id: string;
  label?: string;
  caption?: string;
  imageUrl?: string;
  background?: string;
  content?: ReactNode;
};

type Props = {
  items: CurveCarouselItem[];
  /** Cylinder radius in px. Smaller = more dramatic curve. Default 460. */
  radius?: number;
  /** Card height in px. Default 340. */
  cardHeight?: number;
  /** Tile slot width in px. Defaults to radius-derived cylinder chord width. */
  tileWidth?: number;
  /** CSS perspective distance in px. Lower = closer, stronger depth. Default 860. */
  perspective?: number;
  /** Forward Z offset for the cylinder in px. Higher = pulls carousel toward viewer. Default 140. */
  cameraOffset?: number;
  /** Visible gap between adjacent card faces, in px. Default 14. */
  gap?: number;
  /** Hide cards once they rotate past this angle from center view. Default 132. */
  maxVisibleAngle?: number;
  /** Auto-rotation speed in degrees per second. Default 6. Set to 0 to disable. */
  autoplaySpeed?: number;
  /** Max blur strength for the viewport edge overlay. Default 12. */
  maxBlur?: number;
  /** Optional extra className for the outer wrapper. */
  className?: string;
};

/**
 * Concave 3D carousel — cards lie on the inside of a vertical cylinder.
 * Center card sits deepest (smallest), side cards curve toward the viewer.
 *
 * Geometry: every card transforms once with `rotateY(i * step) translateZ(-R)`.
 * Only the cylinder's `--angle` changes over time. The browser's perspective
 * projection produces all scaling — no per-card scale/x/z math.
 *
 * Width constraint: card_width = 2 * R * tan(step / 2). When this holds,
 * adjacent card edges meet on the cylinder surface (the "plastered to a
 * cylinder" effect). The visible card is rendered slightly narrower inside
 * the slot to produce a small gap without breaking the constraint.
 */
export function CurveCarousel({
  items,
  radius = 600,
  cardHeight = 440,
  tileWidth,
  perspective = 860,
  cameraOffset = 140,
  gap = 14,
  maxVisibleAngle = 132,
  autoplaySpeed = 10,
  maxBlur = 8,
  className,
}: Props) {
  const N = items.length;
  const step = useMemo(() => (N > 0 ? 360 / N : 0), [N]);
  const slotWidth = useMemo(() => {
    if (N === 0) return 0;
    const stepRad = (step * Math.PI) / 180;
    return Math.round(2 * radius * Math.tan(stepRad / 2));
  }, [N, radius, step]);
  const effectiveSlotWidth = tileWidth ?? slotWidth;
  const visibleTileWidth = Math.max(1, effectiveSlotWidth - gap);

  const cylinderRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef = useRef(0);
  const stateRef = useRef({
    dragging: false,
    lastX: 0,
    reducedMotion: false,
  });
  const lastTimeRef = useRef<number | null>(null);

  const visibilityCutoff = Math.min(180, Math.max(1, maxVisibleAngle));
  const fadeStart = Math.max(0, visibilityCutoff - 18);

  const updateSlotVisibility = useCallback((baseAngle: number) => {
    slotRefs.current.forEach((slot, i) => {
      if (!slot) return;

      const normalized = ((((baseAngle + i * step + 180) % 360) + 360) % 360) - 180;
      const distance = Math.abs(normalized);
      const opacity =
        distance <= fadeStart
          ? 1
          : Math.max(0, 1 - (distance - fadeStart) / (visibilityCutoff - fadeStart));

      slot.style.opacity = opacity.toFixed(3);
      slot.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
      slot.style.pointerEvents = opacity > 0.2 ? "" : "none";
    });
  }, [fadeStart, step, visibilityCutoff]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    stateRef.current.reducedMotion = mq.matches;
    const onChange = () => {
      stateRef.current.reducedMotion = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (N === 0) return;
    let raf = 0;
    const tick = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      const s = stateRef.current;
      if (!s.dragging && !s.reducedMotion && autoplaySpeed > 0) {
        angleRef.current = (angleRef.current + autoplaySpeed * dt) % 360;
      }

      const cyl = cylinderRef.current;
      if (cyl) {
        cyl.style.setProperty("--angle", `${angleRef.current}deg`);
      }
      updateSlotVisibility(angleRef.current);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastTimeRef.current = null;
    };
  }, [N, autoplaySpeed, updateSlotVisibility]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    stateRef.current.dragging = true;
    stateRef.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!stateRef.current.dragging) return;
    const dx = e.clientX - stateRef.current.lastX;
    stateRef.current.lastX = e.clientX;
    angleRef.current = (angleRef.current - dx * 0.25 + 720) % 360;
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!stateRef.current.dragging) return;
    stateRef.current.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const wrapperStyle: CSSProperties = {
    ["--lp-cc-radius" as string]: `${radius}px`,
    ["--lp-cc-slot-w" as string]: `${effectiveSlotWidth}px`,
    ["--lp-cc-card-h" as string]: `${cardHeight}px`,
    ["--lp-cc-perspective" as string]: `${perspective}px`,
    ["--lp-cc-camera-offset" as string]: `${cameraOffset}px`,
    ["--lp-cc-edge-blur" as string]: `${Math.max(0, maxBlur)}px`,
  };

  const cylinderStyle: CSSProperties = {
    ["--angle" as string]: "0deg",
  };

  return (
    <div
      className={`lp-curve-carousel${className ? ` ${className}` : ""}`}
      style={wrapperStyle}
    >
      <div className="lp-curve-carousel-mask">
        <div
          className="lp-curve-carousel-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={cylinderRef}
            className="lp-curve-carousel-cylinder"
            style={cylinderStyle}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                ref={(node) => {
                  slotRefs.current[i] = node;
                }}
                className="lp-curve-carousel-slot"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(calc(-1 * var(--lp-cc-radius)))`,
                }}
              >
                <div
                  className={`lp-curve-carousel-card${
                    item.content || item.label || item.caption
                      ? ""
                      : " is-empty"
                  }`}
                  style={{
                    width: `${visibleTileWidth}px`,
                    height: `var(--lp-cc-card-h)`,
                    background: item.background ?? "var(--lp-surface)",
                    backgroundImage: item.imageUrl
                      ? `url("${item.imageUrl}")`
                      : undefined,
                  }}
                >
                  {item.content ??
                    (item.label ? (
                      <div className="lp-curve-carousel-card-text">
                        <span className="lp-curve-carousel-card-label">
                          {item.label}
                        </span>
                        {item.caption && (
                          <span className="lp-curve-carousel-card-caption">
                            {item.caption}
                          </span>
                        )}
                      </div>
                    ) : null)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="lp-curve-carousel-edge lp-curve-carousel-edge-left"
      />
      <div
        aria-hidden="true"
        className="lp-curve-carousel-edge lp-curve-carousel-edge-right"
      />
    </div>
  );
}
