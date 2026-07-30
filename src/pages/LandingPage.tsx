import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/landing.css";
import { SIGN_IN_PAGE_URL } from "../lib/appConfig";
import { Globe } from "../components/ui/globe";
import { StickyFeatures } from "../features/landing/components/StickyFeatures";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

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
  "green",
  "blue",
  "pink",
  "yellow",
  "brown",
] as const;

const ORB_COLORS = ["#55B998", "#7674E8", "#D06CBA", "#F0996B", "#A97A62"] as const;

function RoundedStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.38 3.94Q12 1.5 13.63 3.94Q15.25 6.37 18.17 6.56Q21.09 6.75 19.8 9.38Q18.5 12 19.8 14.63Q21.09 17.25 18.17 17.44Q15.25 17.63 13.63 20.07Q12 22.5 10.38 20.07Q8.75 17.63 5.83 17.44Q2.91 17.25 4.21 14.63Q5.5 12 4.21 9.38Q2.91 6.75 5.83 6.56Q8.75 6.37 10.38 3.94Z" />
    </svg>
  );
}

function PulseOrb({ color, speaking }: { color: string; speaking: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastFrame = performance.now();
    let phase = 0;
    let amplitude = speaking ? 0.55 : 0.18;
    let size = 216;
    let dpr = 1;
    let isVisible = true;
    let grid: Array<{ x: number; y: number; distance: number; angle: number }> = [];

    const draw = () => {
      const maxRadius = size * (4 / 216);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size, size);
      context.fillStyle = color;

      for (const point of grid) {
        const wave =
          Math.sin(point.distance * 6.4 - phase * 3.2) * 0.5 +
          Math.sin(point.angle * 3 + phase * 1.5) * 0.18;
        const scale =
          (1 - point.distance * point.distance * 0.6) *
          (1 + wave * 0.55 * amplitude);
        const radius = Math.max(0.4, maxRadius * scale);

        context.globalAlpha = 0.95 - point.distance * 0.5;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const resize = () => {
      size = Math.max(1, canvas.clientWidth || 216);
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);

      const spacing = size * (13 / 216);
      const maxRadius = size * (4 / 216);
      const fieldRadius = size / 2 - maxRadius - 2;
      const rowHeight = spacing * 0.87;
      const points = [];

      for (
        let row = -Math.ceil(fieldRadius / rowHeight);
        row <= Math.ceil(fieldRadius / rowHeight);
        row += 1
      ) {
        const y = row * rowHeight;
        for (
          let x = -fieldRadius - spacing;
          x <= fieldRadius + spacing;
          x += spacing
        ) {
          const offsetX = x + (Math.abs(row) % 2 ? spacing / 2 : 0);
          const distance = Math.hypot(offsetX, y);
          if (distance > fieldRadius) continue;
          points.push({
            x: offsetX + size / 2,
            y: y + size / 2,
            distance: distance / fieldRadius,
            angle: Math.atan2(y, offsetX),
          });
        }
      }

      grid = points;
      draw();
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const tick = (time: number) => {
      frame = 0;
      if (!isVisible || document.hidden || reducedMotion.matches) return;

      const delta = Math.min((time - lastFrame) / 1000, 0.1);
      lastFrame = time;
      phase += delta;
      const target = speaking ? 1 : 0.18;
      amplitude += (target - amplitude) * Math.min(1, delta * 6);
      draw();
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      stop();
      draw();
      if (isVisible && !document.hidden && !reducedMotion.matches) {
        lastFrame = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        start();
      },
      { rootMargin: "80px" },
    );
    const resizeObserver = new ResizeObserver(resize);
    const onVisibilityChange = () => start();

    visibilityObserver.observe(canvas);
    resizeObserver.observe(canvas);
    reducedMotion.addEventListener("change", start);
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    start();

    return () => {
      stop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [color, speaking]);

  return <canvas ref={canvasRef} className="voice-dotted-orb" aria-hidden="true" />;
}

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
  const element = document.getElementById(id);
  if (!element) return;

  gsap.to(window, {
    duration: 1.25,
    scrollTo: {
      y: element,
      offsetY: 80,
    },
    ease: "expo.inOut",
  });
}

function TopNav({ onBookDemo }: { onBookDemo: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navHeight, setNavHeight] = useState(82);
  const navRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const nextY = window.scrollY;
      const delta = nextY - lastY;

      if (nextY < 80 || delta < -8) setNavHidden(false);
      else if (delta > 8 && !menuOpen) setNavHidden(true);

      if (Math.abs(delta) > 8) lastY = nextY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  return (
    <div className="nav-row-slot" style={{ height: `${navHeight}px` }}>
      <div className="nav-row-fixed-shell">
        <div
          ref={navRef}
          className={`nav-row${menuOpen ? " nav-row--open" : ""}${navHidden ? " nav-row--hidden" : ""}`}
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
        </div>
      </div>
    </div>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <div className="section-tag">
      <span className="section-tag-cross section-tag-cross--left" aria-hidden="true" />
      <span className="t">{label}</span>
      <span className="rule" />
      <span className="section-tag-cross section-tag-cross--right" aria-hidden="true" />
    </div>
  );
}

function OrbDemo({ tall = false }: { tall?: boolean }) {
  const [center, setCenter] = useState(2);
  const [activePlaying, setActivePlaying] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setActivePlaying(-1);
  }, []);

  useEffect(() => stopPlayback, [stopPlayback]);

  const playAnswer = useCallback(
    (index: number) => {
      if (activePlaying === index) {
        stopPlayback();
        return;
      }

      stopPlayback();
      setCenter(index);
      const scene = ORB_SCENES[index];
      if (!scene.audioSrc) return;

      const audio = new Audio(scene.audioSrc);
      audioRef.current = audio;
      audio.ontimeupdate = () => {
        if (!Number.isFinite(audio.duration)) return;
        const fadeTail = scene.fadeOutSeconds ?? 3;
        const remaining = audio.duration - audio.currentTime;
        audio.volume = remaining <= fadeTail ? Math.max(0, remaining / fadeTail) : 1;
      };
      const clear = () => {
        if (audioRef.current === audio) audioRef.current = null;
        setActivePlaying(-1);
      };
      audio.onended = clear;
      audio.onerror = clear;
      void audio.play().then(() => setActivePlaying(index), clear);
    },
    [activePlaying, stopPlayback],
  );

  const activeScene = ORB_SCENES[center];
  const isPlaying = activePlaying === center;

  return (
    <div className={`voice-orb-demo${tall ? " voice-orb-demo--tall" : ""}`}>
      <header className="voice-orb-demo-head">
        <div>
          <h2>See Nodestra in action</h2>
          <p>Five real calls from the terminal. Choose one to hear it.</p>
        </div>
        <span className="voice-orb-demo-head-note">Real Nodestra agent audio</span>
      </header>

      <div className="voice-orb-demo-grid">
        <div className="voice-orb-stage">
          <div className="voice-orb-inset">
            <div className="voice-orb-visual">
              <button
                type="button"
                className={`voice-orb voice-orb--${ORB_VARIANTS[center]}${isPlaying ? " is-speaking" : ""}`}
                onClick={() => playAnswer(center)}
                aria-label={`${isPlaying ? "Stop" : "Play"} ${activeScene.cap} voice sample`}
                aria-pressed={isPlaying}
              >
                <PulseOrb color={ORB_COLORS[center]} speaking={isPlaying} />
              </button>
              <span>{isPlaying ? "Speaking now — tap to stop" : "Tap the dots to hear the call"}</span>
            </div>

            <div className="voice-orb-conversation" aria-live="polite">
              <div>
                <span>Passenger</span>
                <p>“{activeScene.q}”</p>
              </div>
            </div>
          </div>
        </div>

        <div className="voice-orb-capabilities" role="list" aria-label="Voice capabilities">
          {ORB_SCENES.map((scene, index) => {
            const selected = center === index;
            return (
              <button
                key={scene.cap}
                type="button"
                role="listitem"
                className={selected ? "is-active" : ""}
                onClick={() => playAnswer(index)}
                aria-current={selected ? "true" : undefined}
              >
                <span
                  key={`${selected}-${selected && isPlaying}`}
                  className={`voice-orb-star voice-orb-star--${ORB_VARIANTS[index]}`}
                >
                  <RoundedStar />
                </span>
                <span className="voice-orb-capability-copy">
                  <strong>{scene.cap}</strong>
                  <span>{scene.iso}</span>
                </span>
                <span className="voice-orb-capability-action">
                  {selected && isPlaying ? "Stop" : "Play"} <span aria-hidden="true">→</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeroDemo({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <div className="stack" style={{ marginTop: 28 }}>
      <div className="grid g12" style={{ marginTop: 16, alignItems: "end" }}>
        <div className="col-span-7">
          <h1 style={{ fontSize: "clamp(34px, 4vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
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
            Passengers call one number and ask for help in their own words. Nodestra connects to the maps, flight data, and terminal systems your airport already runs, then turns that live context into clear guidance over the phone.
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
            Each answer is usually somewhere — on a display, in a website, at a kiosk, or
            behind a service desk. The passenger still has to find it, interpret it, and
            work out what to do next.
          </p>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 28, gap: 14 }}>
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

const MEMORY_PASSENGERS = [
  { initials: "MR", airport: "LHR → JFK", note: "Wheelchair access · aisle seat · no peanuts", visits: 14 },
  { initials: "YT", airport: "NRT → SFO", note: "Japanese · gate B alerts · lounge access", visits: 7 },
  { initials: "AK", airport: "DXB → CDG", note: "Halal meals · priority boarding · lounge", visits: 22 },
  { initials: "SL", airport: "ORD → MIA", note: "Frequent flier · TSA Pre✓ · window seat", visits: 31 },
  { initials: "FO", airport: "CDG → SIN", note: "French · step-free routing · extra time", visits: 3 },
  { initials: "BW", airport: "JFK → LHR", note: "Business class · express lane · vegan", visits: 18 },
];

function MemorySection() {
  return (
    <div className="lp-memory-section">
      <div className="lp-memory-inner">
        <div className="lp-memory-left">
          <p className="lp-memory-eyebrow">Passenger memory</p>
          <h2 className="lp-memory-heading">Remembers every passenger.</h2>
          <p className="lp-memory-body">
            Cross-call and cross-airport memory retains preferences, accessibility needs, and frequent routes. Returning travelers are greeted like regulars — no matter which airport they land in.
          </p>
          <div className="lp-memory-stats">
            <div className="lp-memory-stat">
              <span className="lp-memory-stat-value">∞</span>
              <span className="lp-memory-stat-label">airports remembered across</span>
            </div>
            <div className="lp-memory-stat">
              <span className="lp-memory-stat-value">0</span>
              <span className="lp-memory-stat-label">times a passenger repeats themselves</span>
            </div>
          </div>
        </div>
        <div className="lp-memory-right">
          {MEMORY_PASSENGERS.map((p, i) => (
            <div key={p.initials} className="lp-memory-row" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-memory-avatar">{p.initials}</div>
              <div className="lp-memory-row-info">
                <span className="lp-memory-route">{p.airport}</span>
                <span className="lp-memory-note">{p.note}</span>
              </div>
              <div className="lp-memory-visits">
                <span className="lp-memory-visits-count">{p.visits}×</span>
                <span className="lp-memory-visits-label">visits</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function toneStyle(tone: BentoTone): React.CSSProperties {
  if (tone === "accent")
    return {
      background:
        "linear-gradient(155deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 72%, #ffffff) 55%, color-mix(in srgb, var(--accent) 50%, #ffffff) 100%)",
      color: "var(--text-dark)",
    };
  if (tone === "tint")
    return {
      background: "#ffffff",
      color: "var(--text-dark)",
    };
  if (tone === "dark")
    return {
      background:
        "linear-gradient(160deg,color-mix(in srgb, var(--text-dark) 82%, var(--blue-core)) 0%,var(--text-dark) 60%,var(--c-ink) 100%)",
      color: "var(--white)",
    };
  return {
    background: "linear-gradient(160deg, #ffffff 0%, #F7F7F7 100%)",
    color: "var(--text-dark)",
  };
}

function PreviewVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => {
    void ref.current?.play().catch(() => {
      /* The poster remains visible if the browser declines playback. */
    });
  };

  const reset = () => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <video
      ref={ref}
      className="bento-video"
      src={src}
      poster={poster}
      muted
      playsInline
      loop
      preload="none"
      onPointerEnter={play}
      onPointerLeave={reset}
      onFocus={play}
      onBlur={reset}
      onClick={() => {
        const video = ref.current;
        if (!video) return;
        if (video.paused) play();
        else reset();
      }}
      tabIndex={0}
      aria-label="Play product preview"
    />
  );
}

function AnalyticsBentoCard({ card }: { card: typeof BENTO_CARDS[number] }) {
  return (
    <div
      className="bento-card area-analytics"
      style={toneStyle(card.tone)}
    >
      <h3 style={{ fontFamily: "var(--display)", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.01em", margin: "0 0 12px", color: "var(--white)" }}>
        {card.t}
      </h3>
      <p style={{ fontFamily: "var(--ui)", fontSize: 13, lineHeight: 1.55, margin: 0, maxWidth: "42ch", color: "rgba(250,250,249,.9)" }}>
        {card.d}
      </p>
      <div className="bento-img bento-video-wrap">
        <PreviewVideo
          src="/assets/analytics-hover.webm"
          poster="/assets/analytics-poster.webp"
        />
      </div>
    </div>
  );
}

function AdsBentoCard({ card }: { card: typeof BENTO_CARDS[number] }) {
  return (
    <div
      className="bento-card area-ads"
      style={toneStyle(card.tone)}
    >
      <h3 style={{ fontFamily: "var(--display)", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.01em", margin: "0 0 12px", color: "var(--text-dark)" }}>
        {card.t}
      </h3>
      <p style={{ fontFamily: "var(--ui)", fontSize: 13, lineHeight: 1.55, margin: 0, maxWidth: "42ch", color: "var(--text-mid)" }}>
        {card.d}
      </p>
      <div className="bento-img bento-video-wrap">
        <PreviewVideo
          src="/assets/ad-revenue-hover.webm"
          poster="/assets/ads-poster.webp"
        />
      </div>
    </div>
  );
}

function FeaturesGrid() {
  return (
    <div className="bento-grid">
      {BENTO_CARDS.map((c) => {
        if (c.id === "analytics") return <AnalyticsBentoCard key={c.id} card={c} />;
        if (c.id === "ads") return <AdsBentoCard key={c.id} card={c} />;

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
                ? <div style={{ width: 160, height: 160, margin: "0 auto" }}>
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

  // Global Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp">
      <div className="sheet">
        <TopNav onBookDemo={openDemo} />
        <div id="section-product" className="lp-hero-wrapper">
          <HeroDemo onBookDemo={openDemo} />
        </div>

        <div className="sections-grid">
          <div id="section-customers">
            <SectionTag label="Why it matters" />
            <ProblemFraming />
          </div>

          <div id="section-how-it-works">
            <SectionTag label="What we are" />
            <div className="lp-section-bridge-block">
              <p className="lp-section-bridge">
                Nodestra gives every passenger one place to ask.
              </p>
              <p className="lp-section-bridge-sub">
                It brings your indoor map, flight telemetry, gate data, and terminal
                information into a voice that can explain what each person should do next.
              </p>
            </div>
            <FeaturesGrid />
            <StickyFeatures />
          </div>

          <div id="section-integrations">
            <SectionTag label="Integrations" />
            <IntegrationsGrid />
          </div>

          <div id="section-memory">
            <MemorySection />
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
