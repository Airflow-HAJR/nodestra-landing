import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import { motionValue } from "motion/react";

type ScrollTarget = string | HTMLElement | number;

// Shared scroll progress (0–1) that Motion components read instead of useScroll().
// Lenis intercepts native scroll, so Motion's useScroll sees nothing without this relay.
export const lenisScrollProgress = motionValue(0);

// Absolute scroll position in px — use this for parallax that needs real pixel offsets.
export const lenisScrollY = motionValue(0);

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

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      lenisScrollProgress.set(limit > 0 ? scroll / limit : 0);
      lenisScrollY.set(scroll);
    });

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
