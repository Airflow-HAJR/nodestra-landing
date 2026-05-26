import { useEffect, useRef } from "react";

declare global {
  interface Window {
    THREE: unknown;
    VANTA?: {
      BIRDS?: (opts: Record<string, unknown>) => { destroy: () => void };
      WAVES?: (opts: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function VantaBirds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.birds.min.js",
      );

      if (cancelled || !containerRef.current || !window.VANTA?.BIRDS) return;

      effectRef.current = window.VANTA.BIRDS({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundColor: 0x00000000, // transparent — let CSS sky tint show through
        color1: 0x888888,
        color2: 0x444444,
        colorMode: "lerp",
        birdSize: 1.2,
        wingSpan: 30,
        speedLimit: 4,
        separation: 60,
        alignment: 50,
        cohesion: 50,
        quantity: 3,
      });
    }

    init();

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="lp-vanta-birds"
      aria-hidden="true"
    />
  );
}
