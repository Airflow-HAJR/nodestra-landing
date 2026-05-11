import { useCallback, useRef, useState } from "react";
import "../styles/landing.css";
import { SIGN_IN_PAGE_URL } from "../lib/appConfig";

const CALENDLY_URL = "https://calendly.com/patra-ritvik/30min";

type OrbScene = {
  cap: string;
  iso: string;
  q: string;
  meta: string;
  a: string;
  audioSrc?: string;
};

const ORB_SCENES: OrbScene[] = [
  {
    cap: "Accessibility",
    iso: "accessible routing · baggage claim",
    q: "Can you find me a wheelchair-accessible route to baggage claim?",
    meta: "asked 412×/day",
    a: "Yes. Take the elevator beside security down one level, follow the blue accessibility signs through corridor B, then continue straight to baggage claim carousel three.",
    audioSrc: "/assets/audio/indoor-mapping-zara.mp3",
  },
  {
    cap: "Multilingual",
    iso: "spanish support · concessions",
    q: "Ayúdame a conseguir un poco de café, por favor.",
    meta: "asked 280×/day",
    a: "Claro. Hay una cafetería abierta a dos minutos de aquí. Camina derecho hasta la tienda de regalos y gira a la izquierda.",
  },
  {
    cap: "Navigation",
    iso: "indoor map · gate B12",
    q: "How do I get to Gate B12 from security?",
    meta: "asked 96×/day",
    a: "Gate B12 is nine minutes from security. Walk straight past duty-free, take the escalator down, then turn right at the food court.",
  },
  {
    cap: "Instantaneous Updates",
    iso: "live updates · A153C",
    q: "Hey, can you track my flight A153C?",
    meta: "asked 174×/day",
    a: "Yes. I'm tracking flight A153C now. It is currently on time, boarding is scheduled to start in twenty-two minutes, and I'll alert you if anything changes.",
  },
  {
    cap: "Flight Status",
    iso: "flight status · food timing",
    q: "Do I have time to get some food before my flight arrives?",
    meta: "asked 41×/day",
    a: "Yes. Your flight arrives in forty minutes. The closest quick option is four minutes away, and the current wait is six minutes.",
  },
];

const ORB_VARIANTS = [
  "orb-green",
  "orb-pink",
  "orb-blue",
  "orb-yellow",
  "orb-black",
] as const;

function NodestraMark() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--hand)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--text-dark)",
      }}
    >
      <img
        src="/assets/nodestra-logo.png"
        alt=""
        style={{ width: 26, height: 22, objectFit: "contain" }}
      />
      nodestra
    </span>
  );
}

function TopNav({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <div className="nav-row">
      <NodestraMark />
      <div className="links">
        <span>Product</span>
        <span>How it works</span>
        <span>Integrations</span>
        <span>Customers</span>
        <span>Pricing</span>
      </div>
      <div className="row">
        <a
          href={SIGN_IN_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--hand)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--text-mid)",
            textDecoration: "none",
          }}
        >
          Sign in
        </a>
        <button type="button" className="btn accent" onClick={onBookDemo}>
          Book demo →
        </button>
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
      audioRef.current = audio;
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
        background: "linear-gradient(180deg,var(--white) 0%,var(--chip-bg) 100%)",
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
          Tap to hear Nodestra's capabilities
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
            Ask Nodestra anything a traveler would ask your terminal.
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
            Real ops data. Real connections. Real answer in ~120ms. No signup.
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
                fontSize: 84,
                lineHeight: 1,
                color: "var(--blue-core)",
                letterSpacing: "-0.02em",
              }}
            >
              3.8
              <span style={{ fontSize: 36, color: "var(--text-soft)" }}>/10</span>
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
                fontSize: 84,
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
                fontSize: 84,
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
  tone: BentoTone;
  area: string;
};

const BENTO_CARDS: BentoCard[] = [
  {
    id: "phone",
    t: "Just pick up the phone.",
    d: "Nodestra is a real phone number any traveler can call — no app install, no QR code, no signup. Easiest entry point for elderly fliers and anyone in a hurry.",
    img: "isometric · grandmother on payphone → routes into kiosk",
    tone: "accent",
    area: "phone",
  },
  {
    id: "lang",
    t: "Speaks 32+ languages.",
    d: "From Mandarin to Yorùbá. Detects spoken language automatically and switches mid-sentence. International fliers are home before they leave the jet bridge.",
    img: "isometric · globe + speech bubbles",
    tone: "tint",
    area: "lang",
  },
  {
    id: "analytics",
    t: "Sees the airport the way travelers do.",
    d: "Every question is a signal. Heatmap of foot traffic, ranked list of confusing wayfinding moments, terminals where signage is failing — delivered to your ops team weekly.",
    img: "isometric · terminal heatmap + dashboard",
    tone: "dark",
    area: "analytics",
  },
  {
    id: "ads",
    t: "New ad revenue, contextually placed.",
    d: '"You have 47 min — Tarbush Mediterranean is 4 min away, $12 avg." Nodestra promotes POIs in the exact moment a traveler can act on them. Sponsored placements with measurable conversion.',
    img: "isometric · sponsored card surfacing",
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
                maxWidth: "42ch",
                color: dark ? "rgba(250,250,249,.9)" : "var(--text-mid)",
              }}
            >
              {c.d}
            </p>
            <div
              className="bento-img"
              style={{
                background: dark
                  ? "repeating-linear-gradient(135deg, rgba(250,250,249,.10) 0 8px, transparent 8px 16px)"
                  : "repeating-linear-gradient(135deg, var(--blue-pale) 0 8px, transparent 8px 16px)",
                border: dark
                  ? "1.5px dashed rgba(250,250,249,.45)"
                  : "1.5px dashed var(--blue-light)",
                color: dark ? "rgba(250,250,249,.75)" : "var(--text-soft)",
              }}
            >
              {c.img}
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
        <HeroDemo onBookDemo={openDemo} />

        <SectionTag label="Why it matters" />
        <ProblemFraming />

        <SectionTag label="Capabilities" />
        <FeaturesGrid />

        <SectionTag label="Integrations" />
        <IntegrationsGrid />

        <SectionTag label="Get a demo on your data" />
        <FinalCTA onBookDemo={openDemo} />

        <Footer />
      </div>
    </div>
  );
}
