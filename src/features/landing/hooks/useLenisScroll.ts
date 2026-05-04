import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";

type ScrollTarget = string | HTMLElement | number;

interface UseLenisScrollResult {
  scrollTo: (target: ScrollTarget, options?: { offset?: number }) => void;
}

export function useLenisScroll(): UseLenisScrollResult {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<UseLenisScrollResult["scrollTo"]>(
    (target, options) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, options);
        return;
      }
      if (typeof target === "string") {
        const el = document.getElementById(target.replace(/^#/, ""));
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [],
  );

  return { scrollTo };
}
