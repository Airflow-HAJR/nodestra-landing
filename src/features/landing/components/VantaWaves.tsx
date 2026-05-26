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

export function VantaWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Load Three.js first, then Vanta waves
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
      );
      await loadScript("/vanta-waves.js");

      if (cancelled || !containerRef.current || !window.VANTA?.WAVES) return;

      effectRef.current = window.VANTA.WAVES({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xd49aa0,        // --blush
        backgroundColor: 0x0f0810, // near-black with plum undertone
        shininess: 30,
        waveHeight: 20,
        waveSpeed: 0.6,
        zoom: 0.9,
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
    <div className="lp-vanta-waves" ref={containerRef} aria-hidden="true" />
  );
}
