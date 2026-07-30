import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "../content";

gsap.registerPlugin(ScrollTrigger);

// Images 1, 5, 4 (2nd and 3rd removed; 5th moved to middle)
const LEFT_STACK = [
  { src: "/assets/stack/voice.webp",        label: "Voice" },
  { src: "/assets/stack/airport-info.webp", label: "Airport Info" },
  { src: "/assets/stack/map-builder.webp",  label: "Map Builder" },
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
  return (
    <div
      className="lp-sf-panel"
      ref={setPanelRef}
      style={
        {
          "--chapter-accent": CHAPTER_ACCENTS[index],
        } as CSSProperties
      }
    >
      <article className="lp-sf-panel-inner">
        <div className="lp-sf-panel-head">
          <span className="lp-sf-panel-rule" aria-hidden="true" />
          <h3 className="lp-sf-panel-title">{chapter.title}</h3>
        </div>

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
      </article>
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
  const washRef = useRef<HTMLDivElement | null>(null);

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


  const sectionRef = useRef<HTMLElement | null>(null);

  /* Transform-only plum curtain. It is visible only while entering or leaving
     the section, then removed from compositing for the long middle stretch. */
  useEffect(() => {
    const section = sectionRef.current;
    const wash = washRef.current;
    if (!wash || !section) return;

    const show = () => {
      wash.style.visibility = "visible";
      wash.style.willChange = "transform";
    };
    const hide = () => {
      wash.style.visibility = "hidden";
      wash.style.willChange = "auto";
    };

    const enterTween = gsap.fromTo(
      wash,
      { scaleY: 0, transformOrigin: "bottom center" },
      { scaleY: 1, transformOrigin: "bottom center", ease: "none", paused: true },
    );
    const enter = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "top top",
      scrub: true,
      animation: enterTween,
      onEnter: show,
      onEnterBack: show,
      onLeave: hide,
      onLeaveBack: hide,
    });

    const exitTween = gsap.fromTo(
      wash,
      { scaleY: 1, transformOrigin: "top center" },
      {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        paused: true,
        immediateRender: false,
      },
    );
    const exit = ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
      animation: exitTween,
      onEnter: show,
      onEnterBack: show,
      onLeave: hide,
      onLeaveBack: hide,
    });

    return () => {
      enter.kill();
      exit.kill();
      enterTween.kill();
      exitTween.kill();
    };
  }, []);

  /* The original stack spread, rebuilt with translate transforms. The old
     margin animation forced layout on every scroll frame. */
  useEffect(() => {
    const items = stackItemRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    const connectors = connectorRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const wrapper = introWrapperRef.current;
    if (!wrapper || items.length < 2) return;

    const movingItems = items.slice(1);
    if (window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) {
      gsap.set(movingItems, { yPercent: 0 });
      gsap.set(connectors, { scaleY: 1, opacity: 1 });
      return;
    }

    gsap.set(movingItems, {
      yPercent: (index) => -(index + 1) * 42,
    });
    gsap.set(connectors, { scaleY: 0, opacity: 0, transformOrigin: "top center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });

    tl.to(movingItems, { yPercent: 0, ease: "power2.inOut" }, 0).to(
      connectors,
      { scaleY: 1, opacity: 1, ease: "power2.inOut" },
      0,
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <>
      <div ref={washRef} className="lp-sf-wash" aria-hidden="true" />
      <section
        id="features"
        className="lp-sf-section is-plum"
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
                  className={`lp-sf-img-stack-item${activePanel < 0 || activePanel === i ? " is-active" : ""}`}
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
    </>
  );
}
