import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CHAPTERS } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

const AUDIO_MAP = [
  "/assets/audio/multilingual.mp3",
  "/assets/audio/instantaneous-updates.mp3",
  "/assets/audio/flight-tracking.mp3",
  "/assets/audio/indoor-navigation.mp3",
  "/assets/audio/airport-info.mp3",
] as const;

const CHAPTER_ACCENTS = [
  "var(--plum)",
  "var(--plum)",
  "var(--plum)",
  "var(--plum)",
  "var(--plum)",
] as const;

type AudioState = "idle" | "loading" | "playing" | "ended" | "error";

/* ─── Audio button ─────────────────────────────────────────────────────────── */

interface AudioButtonProps {
  state: AudioState;
  onClick: () => void;
}

function AudioButton({ state, onClick }: AudioButtonProps) {
  const isDisabled = state === "error";

  const stateClass =
    state === "playing"
      ? " lp-sf-audio-btn--playing"
      : state === "ended"
        ? " lp-sf-audio-btn--ended"
        : state === "error"
          ? " lp-sf-audio-btn--error"
          : "";

  const ariaLabel =
    state === "idle"
      ? "Play voice demo"
      : state === "loading"
        ? "Loading audio"
        : state === "playing"
          ? "Stop playing"
          : state === "ended"
            ? "Replay voice demo"
            : "Audio unavailable";

  return (
    <button
      type="button"
      className={`lp-sf-audio-btn${stateClass}`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {state === "idle" && (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="3,1 13,7 3,13" />
          </svg>
          <span className="lp-sf-audio-label">Play voice demo</span>
        </>
      )}
      {state === "loading" && (
        <>
          <span className="lp-sf-spinner" aria-hidden="true" />
          <span className="lp-sf-audio-label">Loading</span>
        </>
      )}
      {state === "playing" && (
        <>
          <span className="lp-sf-waveform" aria-hidden="true">
            <span className="lp-sf-waveform-bar" />
            <span className="lp-sf-waveform-bar" />
            <span className="lp-sf-waveform-bar" />
            <span className="lp-sf-waveform-bar" />
            <span className="lp-sf-waveform-bar" />
          </span>
          <span className="lp-sf-audio-label">Playing</span>
        </>
      )}
      {state === "ended" && (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm0 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM5.5 4.5v5l4-2.5-4-2.5z" />
          </svg>
          <span className="lp-sf-audio-label">Replay</span>
        </>
      )}
      {state === "error" && (
        <span className="lp-sf-audio-label">Audio unavailable</span>
      )}
    </button>
  );
}

interface FeaturePanelProps {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  audioState: AudioState;
  onAudioClick: () => void;
  setPanelRef: (el: HTMLDivElement | null) => void;
}

function FeaturePanel({
  chapter,
  index,
  audioState,
  onAudioClick,
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
  const dialogueY = useTransform(
    scrollY,
    range,
    reducedMotion ? [0, 0] : [18, -16],
  );
  const statsY = useTransform(
    scrollY,
    range,
    reducedMotion ? [0, 0] : [8, -10],
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
          <p className="lp-sf-panel-kicker">
            {String(index + 1).padStart(2, "0")} / 05
          </p>
          <h3 className="lp-sf-panel-title">{chapter.title}</h3>
        </motion.div>

        <motion.div className="lp-sf-dialogue" style={{ y: dialogueY }}>
          <blockquote className="lp-sf-quote">
            <span className="lp-sf-command-label">Passenger</span>
            <p className="lp-sf-command">{chapter.command}</p>
          </blockquote>
          <div className="lp-sf-response-block">
            <span className="lp-sf-response-label">Nodestra</span>
            <p className="lp-sf-response">{chapter.response}</p>
          </div>
        </motion.div>

        <motion.div className="lp-sf-lower" style={{ y: statsY }}>
          <div className="lp-sf-stats" aria-label={`${chapter.title} metrics`}>
            {chapter.stats.map((stat) => (
              <div key={stat.label} className="lp-sf-stat">
                <div className="lp-sf-stat-value">{stat.value}</div>
                <div className="lp-sf-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <AudioButton state={audioState} onClick={onAudioClick} />
        </motion.div>
      </motion.article>
    </div>
  );
}

/* ─── StickyFeatures ───────────────────────────────────────────────────────── */

export function StickyFeatures() {
  const [audioStates, setAudioStates] = useState<Record<number, AudioState>>(
    {},
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingIdxRef = useRef<number | null>(null);
  const [activePanel, setActivePanel] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* IntersectionObserver for active panel tracking */
  useEffect(() => {
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
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  /* Cleanup audio on unmount */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  function setAudioState(idx: number, state: AudioState) {
    setAudioStates((prev) => ({ ...prev, [idx]: state }));
  }

  function handleAudioClick(idx: number) {
    // If this panel is already playing, stop it
    if (playingIdxRef.current === idx && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      playingIdxRef.current = null;
      setAudioState(idx, "idle");
      return;
    }

    // Stop any other playing audio
    if (audioRef.current) {
      const prev = playingIdxRef.current;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      if (prev !== null) setAudioState(prev, "idle");
      playingIdxRef.current = null;
    }

    // Start new audio
    setAudioState(idx, "loading");
    const audio = new Audio(AUDIO_MAP[idx]);
    audioRef.current = audio;
    playingIdxRef.current = idx;

    audio.addEventListener(
      "canplay",
      () => {
        audio.play().catch(() => setAudioState(idx, "error"));
        setAudioState(idx, "playing");
      },
      { once: true },
    );

    audio.addEventListener(
      "ended",
      () => {
        playingIdxRef.current = null;
        audioRef.current = null;
        setAudioState(idx, "ended");
      },
      { once: true },
    );

    audio.addEventListener(
      "error",
      () => {
        playingIdxRef.current = null;
        audioRef.current = null;
        setAudioState(idx, "error");
      },
      { once: true },
    );
  }

  const progressFillHeight = `${(activePanel / (CHAPTERS.length - 1)) * 100}%`;

  return (
    <section
      id="features"
      className="lp-sf-section"
      aria-labelledby="lp-sf-title"
    >
      <div className="lp-sf-header lp-reveal">
        <p className="lp-sf-eyebrow">Voice features</p>
        <h2 id="lp-sf-title" className="lp-sf-title">
          How Nodestra works
        </h2>
        <p className="lp-sf-lede">
          Each call is answered by the terminal's live data, spoken back in the
          passenger's language.
        </p>
      </div>

      <div className="lp-sf-container">
        {/* Left: sticky sidebar */}
        <div className="lp-sf-left" aria-hidden="true">
          <div className="lp-sf-chapter-num">
            {String(activePanel + 1).padStart(2, "0")} / 05
          </div>
          <div className="lp-sf-left-title">{CHAPTERS[activePanel].title}</div>
          <p className="lp-sf-left-caption">{CHAPTERS[activePanel].caption}</p>

          <div className="lp-sf-progress">
            <div className="lp-sf-progress-track" />
            <div
              className="lp-sf-progress-fill"
              style={{ height: progressFillHeight }}
            />
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.id}
                className={`lp-sf-progress-item${i === activePanel ? " lp-sf-progress-item--active" : ""}`}
              >
                <div className="lp-sf-progress-dot" />
                <span className="lp-sf-progress-label">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {ch.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: scrolling panels */}
        <div className="lp-sf-right">
          {CHAPTERS.map((ch, i) => {
            const state = audioStates[i] ?? "idle";
            return (
              <FeaturePanel
                key={ch.id}
                chapter={ch}
                index={i}
                audioState={state}
                onAudioClick={() => handleAudioClick(i)}
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
