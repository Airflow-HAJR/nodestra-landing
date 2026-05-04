import { useEffect, useMemo, useState } from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Globe } from "@/components/ui/globe";
import { useReducedMotion } from "../hooks/useReducedMotion";

const VIDEO_SRC = `/assets/text-chat.mp4?v=${Date.now()}`;

const GLOBE_MARKERS = [
  { id: "tokyo",   location: [35.68,  139.69] as [number, number], label: "こんにちは" },
  { id: "madrid",  location: [40.42,   -3.70] as [number, number], label: "Hola" },
  { id: "paris",   location: [48.86,    2.35] as [number, number], label: "Bonjour" },
  { id: "berlin",  location: [52.52,   13.41] as [number, number], label: "Hallo" },
  { id: "beijing", location: [39.91,  116.39] as [number, number], label: "你好" },
  { id: "cairo",   location: [30.05,   31.25] as [number, number], label: "مرحبا" },
  { id: "lisbon",  location: [38.72,   -9.14] as [number, number], label: "Olá" },
  { id: "seoul",   location: [37.57,  126.98] as [number, number], label: "안녕하세요" },
];

type ConvSpeaker = "client" | "orb";
interface ConvStep { speaker: ConvSpeaker; text: string; }

const CONVERSATION: ConvStep[] = [
  { speaker: "client", text: "Hi, I need help getting to Gate 12." },
  { speaker: "orb",    text: "Of course! Where are you right now?" },
  { speaker: "client", text: "I'm not sure — I don't know where I am." },
  { speaker: "orb",    text: "No worries. Do you see anything around you — a store, sign, or landmark?" },
  { speaker: "client", text: "I see a Starbucks. TSA is on my right." },
  { speaker: "orb",    text: "Got it! Turn left and walk toward the sign that says Concourse A." },
  { speaker: "client", text: "I see the Concourse A sign!" },
  { speaker: "orb",    text: "Keep going until you see a bookstore on your right." },
  { speaker: "client", text: "I see the bookstore!" },
  { speaker: "orb",    text: "Gate 12 is right on your left. Have a great flight! ✈" },
];

type FeatureTab = "accessible" | "connected" | "proactive";

const FEATURE_TABS: Array<{
  id: FeatureTab; label: string; title: string; description: string;
}> = [
  {
    id: "accessible",
    label: "Accessible",
    title: "Designed for every passenger.",
    description: "Serves 100+ languages out of the box. Built for elderly, disabled, and international travelers — no smartphone, no app, no screen required. Just call a number.",
  },
  {
    id: "connected",
    label: "Connected",
    title: "Wired into your airport.",
    description: "Ingests your indoor terminal map and live flight data. The agent knows every gate, corridor, and update the moment it changes.",
  },
  {
    id: "proactive",
    label: "Proactive",
    title: "Reaches passengers first.",
    description: "When gates change, the agent sends SMS alerts automatically — before passengers know they need them.",
  },
];

const AIRPORT_PROMPTS = [
  ["MY GATE MOVED.", "CAN I STILL", "MAKE IT THERE", "ON TIME?"],
  ["I'M RUNNING", "LATE. CAN YOU", "HELP ME GET", "TO MY GATE?"],
  ["DO I HAVE", "TIME TO GRAB", "COFFEE BEFORE", "BOARDING?"],
  ["WHERE IS MY", "AIRLINE'S", "CHECK IN", "COUNTER?"],
] as const;

const HERO_BOARD_COLS = 15;
const HERO_BOARD_ROWS = 8;

function formatBoardRow(value: string) {
  const truncated = value.slice(0, HERO_BOARD_COLS);
  const leadingSpaces = Math.ceil((HERO_BOARD_COLS - truncated.length) / 2);
  return `${" ".repeat(leadingSpaces)}${truncated}`.padEnd(HERO_BOARD_COLS, " ");
}

export function HeroStage() {
  const { reducedMotion } = useReducedMotion();
  const [promptIndex, setPromptIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<FeatureTab>("accessible");
  const [convStep, setConvStep] = useState(0);

  const prompt = AIRPORT_PROMPTS[promptIndex] ?? AIRPORT_PROMPTS[0];
  const boardRows = useMemo(
    () => ["", "", formatBoardRow(prompt[0]), formatBoardRow(prompt[1]), formatBoardRow(prompt[2]), formatBoardRow(prompt[3]), "", ""],
    [prompt],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setPromptIndex((idx) => (idx + 1) % AIRPORT_PROMPTS.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const currentMsg = CONVERSATION[convStep]!;
  const prevMsg    = convStep > 0 ? CONVERSATION[convStep - 1] : null;
  const orbPhase   = currentMsg.speaker === "orb" ? "speaking" : "listening";

  return (
    <section id="hero" aria-labelledby="lp-hero-title">
      {/* ── Part 1: Opening ── */}
      <AuroraBackground className="lp-hero-part-static lp-hero-part-aerial">
        <div className="lp-hero-opening">
          <div className="lp-hero-opening-copy">
            <h1 id="lp-hero-title" className="lp-hero-opening-title">
              Airport navigation isn't for the faint of heart.
            </h1>
            <p className="lp-hero-opening-statement">
              Simplify it with the power of{" "}
              <span className="lp-hero-infobox-gradient">voice intelligence.</span>
            </p>
          </div>
          <div className="lp-hero-board-wrap" aria-label="Common airport passenger thoughts">
            <TextFlippingBoard
              rows={boardRows}
              colCount={HERO_BOARD_COLS}
              rowCount={HERO_BOARD_ROWS}
              duration={0.9}
              scrambleSteps={3}
              reducedMotion={reducedMotion}
              className="lp-hero-board"
            />
          </div>
        </div>
      </AuroraBackground>

      {/* ── Part 2: Feature tabs ── */}
      <div className="lp-hero-part-static lp-hero-part-terminal" id="product">
        <div className={`lp-feat lp-text-panel lp-feat--tab-${activeTab}`}>

          {/* Pills + tab copy */}
          <div className="lp-feat-header">
            <div className="lp-feat-pills" role="tablist" aria-label="Product features">
              {FEATURE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={activeTab === tab.id}
                  className={`lp-feat-pill${activeTab === tab.id ? " is-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="lp-feat-copy">
              {FEATURE_TABS.filter((t) => t.id !== "proactive").map((tab) => (
                <div
                  key={tab.id}
                  role="tabpanel"
                  aria-hidden={activeTab !== tab.id}
                  className={`lp-feat-copy-pane${activeTab === tab.id ? " is-active" : ""}`}
                >
                  <h2 className="lp-feat-title">{tab.title}</h2>
                  <p className="lp-feat-desc">{tab.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual stage */}
          <div className="lp-feat-stage">

            {/* Accessible: full-width globe, labels appear at marker locations */}
            <div className={`lp-feat-pane${activeTab === "accessible" ? " is-active" : ""}`}>
              <div className="lp-feat-globe-stage">
                <Globe
                  className="lp-feat-globe"
                  markers={GLOBE_MARKERS}
                  markerColor={[0.29, 0.32, 0.47]}
                  baseColor={[0.88, 0.89, 0.94]}
                  glowColor={[0.29, 0.32, 0.47]}
                  dark={0}
                  mapBrightness={7}
                  markerSize={0.05}
                />
              </div>
            </div>

            {/* Connected: VoiceOrb conversation player */}
            <div className={`lp-feat-pane${activeTab === "connected" ? " is-active" : ""}`}>
              <div className="lp-conv-player">

                {/* Gradient orb — shifts faster when orb is speaking */}
                <div className={`lp-conv-orb-wrap lp-conv-orb-wrap--${orbPhase}`}>
                  <div className="lp-hero-gradient-orb" aria-hidden="true" />
                </div>

                {/* Message area */}
                <div className="lp-conv-messages">
                  {prevMsg && (
                    <div className={`lp-conv-bubble lp-conv-bubble--ghost lp-conv-bubble--${prevMsg.speaker}`}>
                      <span className="lp-conv-label">
                        {prevMsg.speaker === "orb" ? "Nodestra" : "Passenger"}
                      </span>
                      {prevMsg.text}
                    </div>
                  )}
                  <div
                    key={convStep}
                    className={`lp-conv-bubble lp-conv-bubble--${currentMsg.speaker}`}
                  >
                    <span className="lp-conv-label">
                      {currentMsg.speaker === "orb" ? "Nodestra" : "Passenger"}
                    </span>
                    {currentMsg.text}
                  </div>
                </div>

                {/* Navigation */}
                <div className="lp-conv-nav">
                  <button
                    type="button"
                    className="lp-conv-arrow"
                    onClick={() => setConvStep((s) => Math.max(0, s - 1))}
                    disabled={convStep === 0}
                    aria-label="Previous message"
                  >
                    ‹
                  </button>
                  <div className="lp-conv-dots" aria-hidden="true">
                    {CONVERSATION.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`lp-conv-dot${i === convStep ? " is-active" : ""}`}
                        onClick={() => setConvStep(i)}
                        aria-label={`Go to step ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="lp-conv-arrow"
                    onClick={() => setConvStep((s) => Math.min(CONVERSATION.length - 1, s + 1))}
                    disabled={convStep === CONVERSATION.length - 1}
                    aria-label="Next message"
                  >
                    ›
                  </button>
                </div>

              </div>
            </div>

            {/* Proactive: text left, video right */}
            <div className={`lp-feat-pane${activeTab === "proactive" ? " is-active" : ""}`}>
              <div className="lp-feat-proactive-split">
                <div className="lp-feat-proactive-copy">
                  <h2 className="lp-feat-title">Reaches passengers first.</h2>
                  <p className="lp-feat-desc">
                    When gates change, the agent sends SMS alerts automatically — before passengers know they need them.
                  </p>
                </div>
                <div className="lp-feat-video-wrap">
                  <video
                    key={VIDEO_SRC}
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="lp-feat-video"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
