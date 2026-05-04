import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

interface GlobeMarker {
  id: string;
  location: [number, number];
  label: string;
}

interface GlobeProps {
  markers?: GlobeMarker[];
  className?: string;
  markerColor?: [number, number, number];
  baseColor?: [number, number, number];
  glowColor?: [number, number, number];
  dark?: number;
  mapBrightness?: number;
  markerSize?: number;
  speed?: number;
}

export function Globe({
  markers = [],
  className = "",
  markerColor = [0.29, 0.32, 0.47],
  baseColor = [0.88, 0.89, 0.94],
  glowColor = [0.29, 0.32, 0.47],
  dark = 0,
  mapBrightness = 7,
  markerSize = 0.04,
  speed = 0.003,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const velocity = useRef(0);
  const phiRef = useRef(0);
  const phiOffsetRef = useRef(0);
  const lastXRef = useRef<{ x: number; t: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (pointerInteracting.current === null) return;
    const delta = e.clientX - pointerInteracting.current;
    dragOffset.current = delta / 300;
    const now = Date.now();
    if (lastXRef.current) {
      const dt = Math.max(now - lastXRef.current.t, 1);
      velocity.current = Math.max(-0.12, Math.min(0.12, ((e.clientX - lastXRef.current.x) / dt) * 0.3));
    }
    lastXRef.current = { x: e.clientX, t: now };
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current;
      dragOffset.current = 0;
      lastXRef.current = null;
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animId = 0;

    function animate() {
      if (!globe) return;
      if (pointerInteracting.current === null) {
        phiRef.current += speed;
        if (Math.abs(velocity.current) > 0.0001) {
          phiOffsetRef.current += velocity.current;
          velocity.current *= 0.95;
        }
      }
      globe.update({
        phi: phiRef.current + phiOffsetRef.current + dragOffset.current,
        markerColor,
        baseColor,
        glowColor,
        dark,
        mapBrightness,
        markers: markers.map((m) => ({ location: m.location, size: markerSize, id: m.id })),
      });
      animId = requestAnimationFrame(animate);
    }

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark,
        diffuse: 1.4,
        mapSamples: 16000,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        markers: markers.map((m) => ({ location: m.location, size: markerSize, id: m.id })),
        opacity: 0.85,
      });
      animId = requestAnimationFrame(animate);
      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1";
      });
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if ((entries[0]?.contentRect.width ?? 0) > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
      return () => {
        cancelAnimationFrame(animId);
        ro.disconnect();
        globe?.destroy();
      };
    }

    return () => {
      cancelAnimationFrame(animId);
      globe?.destroy();
    };
  }, [markers, markerColor, baseColor, glowColor, dark, mapBrightness, markerSize, speed]);

  return (
    <div className={`relative select-none ${className}`} style={{ aspectRatio: "1 / 1" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          className="lp-globe-marker-label"
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 5,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 3px))`,
            transition: "opacity 0.5s ease, filter 0.5s ease",
            pointerEvents: "none",
          }}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}
