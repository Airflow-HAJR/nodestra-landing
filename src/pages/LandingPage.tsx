import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/landing.css";
import { SIGN_IN_PAGE_URL } from "../lib/appConfig";
import { Globe } from "../components/ui/globe";
import { StickyFeatures } from "../features/landing/components/StickyFeatures";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

const CALENDLY_URL = "https://calendly.com/patra-ritvik/30min";

const GLOBE_MARKERS = [
  { id: "hello",      location: [39.9, -75.2]  as [number, number], label: "Hello" },
  { id: "hola",       location: [19.4, -99.1]  as [number, number], label: "Hola" },
  { id: "bonjour",    location: [48.9,   2.4]  as [number, number], label: "Bonjour" },
  { id: "konnichiwa", location: [35.7, 139.7]  as [number, number], label: "こんにちは" },
  { id: "nihao",      location: [31.2, 121.5]  as [number, number], label: "你好" },
  { id: "namaste",    location: [28.6,  77.2]  as [number, number], label: "नमस्ते" },
  { id: "ola",        location: [-23.5, -46.6] as [number, number], label: "Olá" },
];

type OrbScene = {
  cap: string;
  iso: string;
  q: string;
  meta: string;
  a: string;
  audioSrc?: string;
  fadeOutSeconds?: number;
};

const ORB_SCENES: OrbScene[] = [
  {
    cap: "Accessibility",
    iso: "accessible routing · baggage claim",
    q: "Can you find me a wheelchair-accessible route to baggage claim?",
    meta: "asked 412×/day",
    a: "Yes. Take the elevator beside security down one level, follow the blue accessibility signs through corridor B, then continue straight to baggage claim carousel three.",
    audioSrc: "/assets/audio/accessibility-bunty.mp3",
  },
  {
    cap: "Multilingual",
    iso: "spanish support · concessions",
    q: "Lo siento, realmente necesito ir al baño ahora. Por favor, ayúdame.",
    meta: "asked 280×/day",
    a: "Claro. Hay una cafetería abierta a dos minutos de aquí. Camina derecho hasta la tienda de regalos y gira a la izquierda.",
    audioSrc: "/assets/audio/spanish-elomi.mp3",
  },
  {
    cap: "Navigation",
    iso: "indoor map · gate B12",
    q: "How do I get to Gate B12?",
    meta: "asked 96×/day",
    a: "Gate B12 is nine minutes from security. Walk straight past duty-free, take the escalator down, then turn right at the food court.",
    audioSrc: "/assets/audio/gate-b12-lia.mp3",
    fadeOutSeconds: 4,
  },
  {
    cap: "Instantaneous Updates",
    iso: "live updates · A153C",
    q: "Hey, can you track my flight?",
    meta: "asked 174×/day",
    a: "Yes. I'm tracking flight A153C now. It is currently on time, boarding is scheduled to start in twenty-two minutes, and I'll alert you if anything changes.",
    audioSrc: "/assets/audio/flight-a153c-hannah.mp3",
    fadeOutSeconds: 4,
  },
  {
    cap: "Location-based Promotions",
    iso: "gate proximity · concessions",
    q: "Okay, just got to my gate, anything to do?",
    meta: "asked 41×/day",
    a: "Nice! Your flight boards in thirty-five minutes. There's a coffee shop two minutes back with a 10% traveler discount, and a bookstore just across the corridor if you want to browse.",
    audioSrc: "/assets/audio/gate-promo-josh.mp3",
  },
];

const ORB_VARIANTS = [
  "orb-green",
  "orb-blue",
  "orb-pink",
  "orb-yellow",
  "orb-brown",
] as const;

function NodestraMark() {
  return (
    <span className="nodestra-lockup" aria-label="Nodestra">
      <img
        src="/assets/nodestra-mark.svg"
        alt=""
        className="nodestra-logo-mark"
      />
      <span className="nodestra-wordmark">
        nodestra<span className="nodestra-period">.</span>
      </span>
    </span>
  );
}

const NAV_LINKS = [
  { label: "Product", sectionId: "section-product" },
  { label: "How it works", sectionId: "section-how-it-works" },
  { label: "Integrations", sectionId: "section-integrations" },
  { label: "Customers", sectionId: "section-customers" },
  { label: "Pricing", sectionId: "section-pricing" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function TopNav({ onBookDemo }: { onBookDemo: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isTopEdgeHovering, setIsTopEdgeHovering] = useState(false);
  const [navHeight, setNavHeight] = useState(82);
  const navRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const measureHeight = () => setNavHeight(navEl.offsetHeight);
    measureHeight();

    const ro = new ResizeObserver(measureHeight);
    ro.observe(navEl);
    window.addEventListener("resize", measureHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureHeight);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (currentY) => {
    const deltaY = currentY - lastScrollYRef.current;

    if (menuOpen) {
      setIsNavVisible(true);
      lastScrollYRef.current = currentY;
      return;
    }

    if (currentY <= 24) {
      setIsNavVisible(true);
    } else if (currentY > 180 && deltaY > 6) {
      setIsNavVisible(false);
    } else if (deltaY < -3) {
      setIsNavVisible(true);
    }

    lastScrollYRef.current = currentY;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMouseMove = (event: MouseEvent) => {
      setIsTopEdgeHovering(event.clientY <= 28);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      setIsTopEdgeHovering(false);
    };
  }, []);

  const shouldShowNav = menuOpen || isNavVisible || isTopEdgeHovering;

  return (
    <div className="nav-row-slot" style={{ height: `${navHeight}px` }}>
      <div className="nav-row-fixed-shell">
        <motion.div
          ref={navRef}
          className={`nav-row${menuOpen ? " nav-row--open" : ""}${!shouldShowNav ? " nav-row--hidden" : ""}`}
          initial={false}
          animate={shouldShowNav ? "visible" : "hidden"}
          variants={{
            visible: {
              y: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 260, damping: 32, mass: 0.95 },
            },
            hidden: {
              y: -96,
              opacity: 0,
              transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <NodestraMark />
          <div className="links">
            {NAV_LINKS.map(({ label, sectionId }) => (
              <span key={label} onClick={() => scrollToSection(sectionId)}>{label}</span>
            ))}
          </div>
          <div className="row nav-row-actions">
            <a
              href={SIGN_IN_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-signin"
            >
              Sign in
            </a>
            <button type="button" className="btn nav-cta" onClick={onBookDemo}>
              Book demo
            </button>
          </div>
          <button
            type="button"
            className="nav-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
          {menuOpen && (
            <div className="nav-mobile-menu">
              {NAV_LINKS.map(({ label, sectionId }) => (
                <span key={label} className="nav-mobile-item" onClick={() => { setMenuOpen(false); scrollToSection(sectionId); }}>
                  {label}
                </span>
              ))}
              <div className="nav-mobile-footer">
                <a
                  href={SIGN_IN_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-signin"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </a>
                <button
                  type="button"
                  className="btn nav-cta"
                  onClick={() => {
                    setMenuOpen(false);
                    onBookDemo();
                  }}
                >
                  Book demo
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <div className="section-tag">
      <span className="t">{label}</span>
      <span className="rule" />
    </div>
  );
}

function OrbDemo({ tall = false }: { tall?: boolean }) {
  const [center, setCenter] = useState(2);
  const [activePlaying, setActivePlaying] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const playAnswer = useCallback((i: number) => {
    setCenter(i);
    setActivePlaying(i);
    stopPlayback();
    setSpeaking(true);
    const scene = ORB_SCENES[i];
    if (scene.audioSrc) {
      const audio = new Audio(scene.audioSrc);
      audio.volume = 1;
      audioRef.current = audio;
      audio.ontimeupdate = () => {
        if (!Number.isFinite(audio.duration)) return;
        const remaining = audio.duration - audio.currentTime;
        audio.volume = remaining <= 4 ? Math.max(0, remaining / 4) : 1;
      };
      audio.onplay = () => setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
        setActivePlaying(-1);
      };
      audio.onerror = () => {
        setSpeaking(false);
        setActivePlaying(-1);
      };
      void audio.play().catch(() => {
        setSpeaking(false);
        setActivePlaying(-1);
      });
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance(scene.a);
      u.rate = 1.02;
      u.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find((v) => /en[-_]/i.test(v.lang));
      if (en) u.voice = en;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        setActivePlaying(-1);
      };
      window.speechSynthesis.speak(u);
    } catch {
      setSpeaking(false);
      setActivePlaying(-1);
      /* no audio in this browser */
    }
  }, [stopPlayback]);

  const shift = useCallback(
    (delta: number) => {
      setCenter((c) => Math.max(0, Math.min(ORB_SCENES.length - 1, c + delta)));
      stopPlayback();
      setSpeaking(false);
      setActivePlaying(-1);
    },
    [stopPlayback],
  );

  const activeScene = ORB_SCENES[center];

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 18,
        padding: "36px 28px 18px",
        background: "linear-gradient(180deg,var(--white) 0%,#F5F2F6 100%)",
        border: "1.5px solid var(--border)",
        overflow: "hidden",
        minHeight: tall ? 500 : 460,
      }}
    >
      <div style={{ marginBottom: 18, position: "relative", zIndex: 3 }}>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 24,
            lineHeight: 1,
            color: "var(--text-dark)",
            fontWeight: 700,
          }}
        >
          5 key capabilities, just tap to hear. 
        </div>
        <div style={{ marginTop: 10, height: 1.5, background: "var(--border)" }} />
      </div>

      {/* gooey filter for orb balls */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <filter id="lpGooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          <feColorMatrix
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10"
          />
        </filter>
      </svg>

      <div className="orb-carousel">
        <button
          type="button"
          className="orb-carousel-nav prev"
          onClick={() => shift(-1)}
          disabled={center === 0}
          aria-label="Previous orb"
        >
          ←
        </button>
        <button
          type="button"
          className="orb-carousel-nav next"
          onClick={() => shift(1)}
          disabled={center === ORB_SCENES.length - 1}
          aria-label="Next orb"
        >
          →
        </button>

        {ORB_SCENES.map((s, i) => {
          const d = i - center;
          const abs = Math.abs(d);
          const orbVisualSize = 64 * 2.025;
          const scaleByDistance = [1, 0.58, 0.28];
          const equalGap = 75;
          const offsetByDistance = [
            0,
            (orbVisualSize * scaleByDistance[0]) / 2 +
              (orbVisualSize * scaleByDistance[1]) / 2 +
              equalGap,
            (orbVisualSize * scaleByDistance[0]) / 2 +
              orbVisualSize * scaleByDistance[1] +
              (orbVisualSize * scaleByDistance[2]) / 2 +
              equalGap * 2,
          ];
          const tx = Math.sign(d) * (offsetByDistance[abs] ?? 0);
          const scale = scaleByDistance[abs] ?? 0.28;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.88 : abs === 2 ? 0.34 : 0;
          const pointerEvents = abs <= 1 ? "auto" : "none";
          return (
            <div
              key={i}
              className="orb-slot"
              data-orb-distance={abs}
              style={{
                transform: `translateX(${tx}px) scale(${scale})`,
                zIndex: 10 - abs,
                opacity,
                pointerEvents,
              }}
            >
              <div className="container-vao">
                <button
                  type="button"
                  onClick={() => playAnswer(i)}
                  aria-label={`Play: ${s.q}`}
                  aria-pressed={activePlaying === i && speaking}
                  className={`orb ${ORB_VARIANTS[i]}${
                    activePlaying === i && speaking ? " is-speaking" : ""
                  }`}
                >
                  <div className="icons">
                    <svg
                      className="svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g className="close">
                        <path
                          fill="currentColor"
                          d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"
                        />
                      </g>
                      <g fill="none" className="mic">
                        <rect width="8" height="13" x="8" y="2" fill="currentColor" rx="4" />
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 11a7 7 0 1 0 14 0m-7 10v-2"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="ball">
                    <div className="container-lines" />
                    <div className="container-rings" />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="stack"
        style={{
          alignItems: "center",
          gap: 6,
          textAlign: "center",
          marginTop: 18,
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          className="lbl"
          style={{
            color: "var(--blue-core)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: 11,
          }}
        >
          {activeScene.cap}
        </span>
        <div
          style={{
            fontFamily: "var(--ui)",
            fontWeight: 700,
            fontSize: 26,
            lineHeight: 1.15,
            color: "var(--text-dark)",
            maxWidth: "32ch",
          }}
        >
          "{activeScene.q}"
        </div>
        <span className="lbl" style={{ color: "var(--text-soft)" }}>
          {activeScene.meta}
        </span>
      </div>
    </div>
  );
}

function HeroDemo({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <div className="stack" style={{ marginTop: 28 }}>
      <div className="grid g12" style={{ marginTop: 16, alignItems: "end" }}>
        <div className="col-span-7">
          <h1 style={{ fontSize: 42, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            Simplify the passenger experience at your airport with voice intelligence.
          </h1>
          <p
            style={{
              fontFamily: "var(--ui)",
              fontSize: 14,
              opacity: 0.7,
              marginTop: 14,
              maxWidth: "55ch",
            }}
          >
            The Nodestra AI agent connects with your airport's current softwares to curate personalized, intelligent guidance for every passenger to navigate through airports. All over the phone, all through voice.
          </p>
        </div>
        <div className="col-span-5 row" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button type="button" className="btn accent" onClick={onBookDemo}>
            Book demo →
          </button>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <OrbDemo tall />
      </div>
    </div>
  );
}

function ProblemFraming() {
  return (
    <div className="stack">
      <div className="grid g12" style={{ alignItems: "end" }}>
        <div className="col-span-7">
          <div className="mega" style={{ fontSize: 50 }}>
            A traveler asks{" "}
            <span className="underline-hand" style={{ fontSize: 50 }}>
              47 questions
            </span>{" "}
            between curbside and gate.
          </div>
        </div>
        <div className="col-span-5 stack">
          <span className="lbl">Source: airport ops surveys, 2024–25</span>
          <p style={{ fontFamily: "var(--hand)", fontSize: 18, lineHeight: 1.35 }}>
            That means travelers must juggle 47 different non-intuitive websites, kiosks,
            or display boards just to get through your airport. That sucks.
          </p>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 28, gap: 14 }}>
        <div className="row" style={{ gap: 10 }}>
          <span className="pill tint" style={{ fontFamily: "Inter" }}>
            IMPACT
          </span>
          <span className="scribble" style={{ color: "var(--text-mid)" }}>
            source: ACI passenger experience benchmark · 2024–25
          </span>
        </div>
        <div className="grid g12" style={{ gap: 14, alignItems: "stretch" }}>
          <div className="col-span-4 box tint" style={{ padding: 22 }}>
            <span className="lbl">avg. passenger satisfaction</span>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: 56,
                lineHeight: 1,
                color: "var(--blue-core)",
                letterSpacing: "-0.02em",
              }}
            >
              3.8
              <span style={{ fontSize: 28, color: "var(--text-soft)" }}>/10</span>
            </div>
            <p
              style={{
                fontFamily: "var(--ui)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--text-mid)",
                marginTop: 6,
              }}
            >
              nationally, US hub airports.
              <br />
              Almost two-thirds of fliers leave frustrated.
            </p>
          </div>
          <div className="col-span-4 box accent" style={{ padding: 22 }}>
            <span className="lbl" style={{ color: "rgba(250,250,249,.8)" }}>
              per satisfied passenger
            </span>
            <div
              style={{
                fontFamily: "var(--display)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontSize: 56,
              }}
            >
              +$16
            </div>
            <p
              style={{
                fontFamily: "var(--ui)",
                fontSize: 12,
                lineHeight: 1.5,
                opacity: 0.9,
                marginTop: 6,
              }}
            >
              extra spend in terminal commerce.
              <br />
              Food, retail, lounges, parking add-ons.
            </p>
          </div>
          <div className="col-span-4 box solid" style={{ padding: 22 }}>
            <span className="lbl">left on the table</span>
            <div
              style={{
                fontFamily: "var(--display)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "var(--white)",
                fontSize: 56,
              }}
            >
              $millions
            </div>
            <p
              style={{
                fontFamily: "var(--ui)",
                fontSize: 12,
                lineHeight: 1.5,
                opacity: 0.85,
                marginTop: 6,
              }}
            >
              per terminal, per year. Forfeit by airports that haven't optimized the
              passenger journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type BentoTone = "accent" | "tint" | "dark" | "white";

type BentoCard = {
  id: string;
  t: string;
  d: string;
  img: string;
  imgSrc?: string;
  tone: BentoTone;
  area: string;
};

const BENTO_CARDS: BentoCard[] = [
  {
    id: "phone",
    t: "Over the phone.",
    d: "Not everyone can download an app, work with a clunky website, or interpret laggy kiosks. But everyone knows how to call a phone number, whether elderly, disabled, etc.",
    img: "isometric · grandmother on payphone → routes into kiosk",
    tone: "accent",
    area: "phone",
  },
  {
    id: "lang",
    t: "Speaks 32+ languages.",
    d: "So, every international flier is supported.",
    img: "isometric · globe + speech bubbles",
    tone: "tint",
    area: "lang",
  },
  {
    id: "analytics",
    t: "Analytics reimagined.",
    d: "Foot traffic, confusing concourses, common languages and pain points, all aggregated by one agent.",
    img: "isometric · terminal heatmap + dashboard",
    tone: "dark",
    area: "analytics",
  },
  {
    id: "ads",
    t: "Ad revenue, on the map.",
    d: 'Nodestra promotes sponsored stores as passengers pass them, so foot traffic becomes money.',
    img: "isometric · sponsored card surfacing",
    imgSrc: "/assets/ad-revenue.png",
    tone: "white",
    area: "ads",
  },
  {
    id: "a11y",
    t: "Built for every body.",
    d: "Personalized settings, SMS fallback, screen-reader-first design, signed-language video, step-free routing. Disabled travelers get the airport built around them.",
    img: "isometric · PRM step-free path + SMS thread",
    tone: "tint",
    area: "a11y",
  },
];

function toneStyle(tone: BentoTone): React.CSSProperties {
  if (tone === "accent")
    return {
      background:
        "linear-gradient(155deg,var(--accent) 0%, color-mix(in srgb, var(--accent) 82%, var(--white)) 48%, color-mix(in srgb, var(--accent) 64%, var(--white)) 100%)",
      color: "var(--white)",
    };
  if (tone === "tint")
    return {
      background: "linear-gradient(160deg,var(--white) 0%,var(--tint) 55%,var(--chip-bg) 100%)",
      color: "var(--text-dark)",
    };
  if (tone === "dark")
    return {
      background:
        "linear-gradient(160deg,color-mix(in srgb, var(--text-dark) 82%, var(--blue-core)) 0%,var(--text-dark) 60%,var(--c-ink) 100%)",
      color: "var(--white)",
    };
  return {
    background: "linear-gradient(160deg,var(--white) 0%,var(--tint) 60%,var(--chip-bg) 100%)",
    color: "var(--text-dark)",
  };
}

function FeaturesGrid() {
  return (
    <div className="bento-grid">
      {BENTO_CARDS.map((c) => {
        const dark = c.tone === "accent" || c.tone === "dark";
        return (
          <div
            key={c.id}
            className={`bento-card area-${c.area}`}
            style={toneStyle(c.tone)}
          >
            <h3
              style={{
                fontFamily: "var(--display)",
                fontSize: c.area === "phone" ? 56 : 32,
                lineHeight: c.area === "phone" ? 1 : 1.05,
                letterSpacing: "-0.01em",
                margin: "0 0 12px",
                color: dark ? "var(--white)" : "var(--text-dark)",
              }}
            >
              {c.t}
            </h3>
            <p
              style={{
                fontFamily: "var(--ui)",
                fontSize: c.area === "phone" ? 14 : 13,
                lineHeight: 1.55,
                margin: 0,
                maxWidth: (c.id === "phone" || c.id === "a11y") ? "58ch" : "42ch",
                color: dark ? "rgba(250,250,249,.9)" : "var(--text-mid)",
              }}
            >
              {c.d}
            </p>
            <div
              className="bento-img"
              style={c.imgSrc || c.id === "lang" ? { background: "none", border: "none", padding: 0 } : {
                background: dark
                  ? "repeating-linear-gradient(135deg, rgba(250,250,249,.10) 0 8px, transparent 8px 16px)"
                  : "repeating-linear-gradient(135deg, var(--blue-pale) 0 8px, transparent 8px 16px)",
                border: dark
                  ? "1.5px dashed rgba(250,250,249,.45)"
                  : "1.5px dashed var(--blue-light)",
                color: dark ? "rgba(250,250,249,.75)" : "var(--text-soft)",
              }}
            >
              {c.id === "lang"
                ? <div style={{ width: 220, height: 220, margin: "0 auto" }}>
                    <Globe
                      markers={GLOBE_MARKERS}
                      baseColor={[0.82, 0.82, 0.82]}
                      glowColor={[0.65, 0.65, 0.65]}
                      markerColor={[0.1, 0.1, 0.1]}
                      dark={0}
                      mapBrightness={9}
                      speed={0.004}
                    />
                  </div>
                : c.imgSrc
                  ? <img src={c.imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : c.img}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const INTEGRATION_GROUPS = [
  {
    cat: "Passenger Systems",
    items: ["Amadeus Altea", "Sabre SabreSonic", "Navitaire"],
  },
  {
    cat: "Departure Control",
    items: ["SITA Flex", "ARINC vMUSE", "Resa AirportConnect"],
  },
  { cat: "Baggage / BHS", items: ["BEUMER", "Vanderlande", "Siemens Logistics"] },
  { cat: "Flight data", items: ["FlightAware", "OAG", "Cirium", "ACDM"] },
  { cat: "Wayfinding", items: ["LocusLabs", "Pointr", "Mapxus"] },
  { cat: "Comms", items: ["Twilio", "Genesys", "Five9", "Salesforce SC"] },
];

function IntegrationsGrid() {
  return (
    <div className="grid g3">
      {INTEGRATION_GROUPS.map((g) => (
        <div key={g.cat} className="box">
          <span className="lbl">{g.cat}</span>
          <div className="stack" style={{ gap: 6, marginTop: 8 }}>
            {g.items.map((it) => (
              <div key={it} className="row" style={{ gap: 8 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    background:
                      "repeating-linear-gradient(135deg, var(--blue-pale) 0 6px, transparent 6px 12px)",
                    border: "1.5px dashed var(--blue-light)",
                    borderRadius: 4,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: "var(--hand)", fontSize: 15 }}>{it}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FinalCTA({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <div className="box accent" style={{ padding: "40px 32px" }}>
      <div className="grid g12" style={{ alignItems: "center" }}>
        <div className="col-span-8">
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 54,
              lineHeight: 1,
              fontWeight: 700,
            }}
          >
            Ready to give your terminal a brain?
          </div>
          <p
            style={{
              fontFamily: "var(--ui)",
              fontSize: 14,
              opacity: 0.9,
              marginTop: 10,
            }}
          >
            45-minute demo · we bring a sample integration against your live ops data · no
            procurement detour.
          </p>
        </div>
        <div className="col-span-4 stack">
          <button
            type="button"
            className="btn"
            onClick={onBookDemo}
            style={{
              background: "var(--white)",
              borderColor: "var(--white)",
              color: "var(--text-dark)",
              justifyContent: "center",
            }}
          >
            Book a demo →
          </button>
          <a
            href={SIGN_IN_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "transparent",
              borderColor: "var(--white)",
              color: "var(--white)",
              justifyContent: "center",
            }}
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="stack" style={{ marginTop: 48 }}>
      <div className="line" />
      <div className="row between" style={{ paddingTop: 8 }}>
        <div className="row" style={{ gap: 18 }}>
          <NodestraMark />
          <span className="lbl">© {new Date().getFullYear()} Nodestra Aviation Systems</span>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <span className="lbl">Security</span>
          <span className="lbl">SOC 2</span>
          <span className="lbl">Status</span>
          <span className="lbl">Careers</span>
          <span className="lbl">Contact</span>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const openDemo = useCallback(() => {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="lp">
      <div className="sheet">
        <TopNav onBookDemo={openDemo} />
        <div id="section-product">
          <HeroDemo onBookDemo={openDemo} />
        </div>

        <div className="sections-grid">
          <div id="section-customers">
            <SectionTag label="Why it matters" />
            <ProblemFraming />
          </div>

          <div id="section-how-it-works">
            <SectionTag label="Capabilities" />
            <FeaturesGrid />
            <StickyFeatures />
          </div>

          <div id="section-integrations">
            <SectionTag label="Integrations" />
            <IntegrationsGrid />
          </div>

          <div id="section-pricing">
            <SectionTag label="Get a demo on your data" />
            <FinalCTA onBookDemo={openDemo} />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
