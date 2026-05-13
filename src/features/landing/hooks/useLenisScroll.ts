import { useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";
import { motionValue } from "motion/react";

interface UseLenisScrollArgs {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  enabled: boolean;
}

export function useLenisScroll({
  wrapperRef,
  contentRef,
  enabled,
}: UseLenisScrollArgs) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollProgress = useRef(motionValue(0)).current;
  const scrollY = useRef(motionValue(0)).current;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const syncNativeScroll = () => {
      const limit = wrapper.scrollHeight - wrapper.clientHeight;
      scrollY.set(wrapper.scrollTop);
      scrollProgress.set(limit > 0 ? wrapper.scrollTop / limit : 0);
    };

    syncNativeScroll();

    if (!enabled) {
      wrapper.addEventListener("scroll", syncNativeScroll, { passive: true });
      return () => {
        wrapper.removeEventListener("scroll", syncNativeScroll);
      };
    }

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: wrapper,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      virtualScroll: ({ deltaY }) => {
        const limit = wrapper.scrollHeight - wrapper.clientHeight;
        if (limit <= 0) return false;

        const scrollTop = wrapper.scrollTop;
        const releaseThreshold = Math.min(
          160,
          Math.max(64, wrapper.clientHeight * 0.18),
        );
        const atTop = scrollTop <= releaseThreshold;
        const atBottom = limit - scrollTop <= releaseThreshold;

        if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
          return false;
        }

        return true;
      },
    });
    lenisRef.current = lenis;

    const unsubscribe = lenis.on("scroll", (instance) => {
      scrollProgress.set(instance.progress);
      scrollY.set(instance.scroll);
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [contentRef, enabled, scrollProgress, scrollY, wrapperRef]);

  return { scrollProgress, scrollY };
}
