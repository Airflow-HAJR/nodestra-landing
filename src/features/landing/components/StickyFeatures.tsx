import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Images 1, 5, 4 (2nd and 3rd removed; 5th moved to middle)
const LEFT_STACK = [
  { src: "/assets/stack/voice.png",        label: "Voice" },
  { src: "/assets/stack/airport-info.png", label: "Airport Info" },
  { src: "/assets/stack/map-builder.png",  label: "Map Builder" },
];

const CHAPTER_ACCENTS = [
  "var(--plum)",
  "var(--plum)",
  "var(--plum)",
  "var(--plum)",
  "var(--plum)",
] as const;

interface FeaturePanelProps {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  setPanelRef: (el: HTMLDivElement | null) => void;
}

function FeaturePanel({
  chapter,
  index,
  setPanelRef,
}: FeaturePanelProps) {
  const { reducedMotion } = useReducedMotion();
  const { scrollY } = useScroll();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelTop, setPanelTop] = useState(0);
  const [viewportH, setViewportH] = useState(1);

  useEffect(() => {
    function measure() {
      const rect = panelRef.current?.getBoundingClientRect();
      setPanelTop((rect?.top ?? 0) + window.scrollY);
      setViewportH(window.innerHeight || 1);
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const range: [number, number] = [
    panelTop - viewportH * 0.8,
    panelTop + viewportH * 0.55,
  ];
  const titleY = useTransform(
    scrollY,
    range,
    reducedMotion ? [0, 0] : [34, -28],
  );
  const clipPath = useTransform(
    scrollY,
    [range[0], panelTop - viewportH * 0.18],
    reducedMotion
      ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
      : ["inset(8% 0% 8% 0%)", "inset(0% 0% 0% 0%)"],
  );

  const setRefs = (el: HTMLDivElement | null) => {
    panelRef.current = el;
    setPanelRef(el);
  };

  return (
    <div
      className="lp-sf-panel"
      ref={setRefs}
      style={
        {
          "--chapter-accent": CHAPTER_ACCENTS[index],
        } as CSSProperties
      }
    >
      <motion.article className="lp-sf-panel-inner" style={{ clipPath }}>
        <motion.div className="lp-sf-panel-head" style={{ y: titleY }}>
          <span className="lp-sf-panel-rule" aria-hidden="true" />
          <h3 className="lp-sf-panel-title">{chapter.title}</h3>
        </motion.div>

        <div className="lp-sf-text-box">
          <p>{chapter.copy}</p>
        </div>

        <div className="lp-sf-lower">
          <div className="lp-sf-stats" aria-label={`${chapter.title} metrics`}>
            {chapter.stats.map((stat) => (
              <div key={stat.label} className="lp-sf-stat">
                <div className="lp-sf-stat-value">{stat.value}</div>
                <div className="lp-sf-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/* ─── StickyFeatures ───────────────────────────────────────────────────────── */

export function StickyFeatures() {
  const [activePanel, setActivePanel] = useState(-1);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Outer tall wrapper — gives scroll room for the spread animation */
  const introWrapperRef = useRef<HTMLDivElement | null>(null);
  /** Inner sticky panel — watched for active-panel tracking */
  const introPanelRef = useRef<HTMLDivElement | null>(null);
  const stackItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* IntersectionObserver for active panel tracking (intro = -1, chapters = 0/1/2) */
  useEffect(() => {
    const introOb = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActivePanel(-1); },
      { threshold: 0.4 },
    );
    if (introPanelRef.current) introOb.observe(introPanelRef.current);

    const obs = panelRefs.current.map((el, i) => {
      if (!el) return null;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActivePanel(i);
        },
        { threshold: 0.4 },
      );
      ob.observe(el);
      return ob;
    });
    return () => {
      introOb.disconnect();
      obs.forEach((o) => o?.disconnect());
    };
  }, []);


  /* GSAP: snap page background/class when section enters view */
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const overlay = document.getElementById("lp-bg-overlay");
    const section = sectionRef.current;
    const pageRoot = section?.closest(".lp");
    if (!overlay || !section || !pageRoot) return;

    const goPlum = () => {
      overlay.style.backgroundColor = "#ffffff";
      section.classList.add("is-plum");
      pageRoot.classList.add("is-plum-story");
    };
    const goWhite = () => {
      overlay.style.backgroundColor = "#ffffff";
      section.classList.remove("is-plum");
      pageRoot.classList.remove("is-plum-story");
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      onEnter: goPlum,
      onLeaveBack: goWhite,
    });

    /* reset as soon as the next section begins entering the viewport */
    const stOut = ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      onEnter: goWhite,
      onLeaveBack: goPlum,
    });

    return () => {
      st.kill();
      stOut.kill();
    };
  }, []);

  /* GSAP: spread images as section scrolls into view (~100vh window, no lag) */
  useEffect(() => {
    const items = stackItemRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    const connectors = connectorRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const wrapper = introWrapperRef.current;
    if (!wrapper || items.length < 2) return;

    // Start fully stacked
    gsap.set(items.slice(1), { marginTop: "-62%" });
    gsap.set(connectors, { height: 0, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        // Start only once the intro panel is fully locked (wrapper top === viewport top).
        // End when the wrapper's extra scroll budget is exhausted (bottom === viewport bottom).
        // This is exactly the 150vh of "pinned" scroll — animation plays only while locked.
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
      },
    });

    // Spread to -22% overlap — clearly 3 cards, still fit in 100dvh
    tl.to(items.slice(1), { marginTop: "-22%", ease: "power2.out" }, 0)
      .to(connectors, { height: 20, opacity: 1, ease: "power2.out" }, 0);

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="features"
      className="lp-sf-section"
      aria-labelledby="lp-sf-title"
      ref={sectionRef}
    >
      <div className="lp-sf-container">
        {/* Left: sticky sidebar — image stack only */}
        <div className="lp-sf-left">
          <div className="lp-sf-img-stack">
            {LEFT_STACK.map((img, i) => (
              <Fragment key={img.src}>
                {i > 0 && (
                  <div
                    className="lp-sf-stack-connector"
                    ref={(el) => { connectorRefs.current[i - 1] = el; }}
                  />
                )}
                <button
                  type="button"
                  className={`lp-sf-img-stack-item${activePanel === i ? " is-active" : ""}`}
                  style={{ "--stack-i": i } as CSSProperties}
                  aria-label={`Scroll to ${img.label} section`}
                  ref={(el) => { stackItemRefs.current[i] = el; }}
                  onClick={() => {
                    panelRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  <img src={img.src} alt={img.label} loading="lazy" />
                </button>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Right: scrolling panels */}
        <div className="lp-sf-right">
          {/* Intro wrapper: 250vh tall so text pins while images spread (150vh budget) */}
          <div className="lp-sf-intro-wrapper" ref={introWrapperRef}>
            <div className="lp-sf-panel lp-sf-panel--intro" ref={introPanelRef}>
              <div className="lp-sf-panel-inner">
                <span className="lp-sf-panel-rule" aria-hidden="true" />
                {/* <p className="lp-sf-panel-kicker">How it works</p> */}
                <h2 id="lp-sf-title" className="lp-sf-intro-heading">
                  3 Layers of Nodestra Intelligence
                </h2>
                {<p className="lp-sf-intro-sub">
                  Tailored for every part of your airport.
                </p>}
              </div>
            </div>
          </div>

          {CHAPTERS.slice(0, 3).map((ch, i) => {
            return (
              <FeaturePanel
                key={ch.id}
                chapter={ch}
                index={i}
                setPanelRef={(el) => {
                  panelRefs.current[i] = el;
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
