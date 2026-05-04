import { useEffect, useMemo, useState } from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";
import { useReducedMotion } from "../hooks/useReducedMotion";

const AIRPORT_PROMPTS = [
  ["MY GATE MOVED.", "CAN I STILL", "MAKE IT THERE", "ON TIME?"],
  ["I'M RUNNING", "LATE. CAN YOU", "HELP ME GET", "TO MY GATE?"],
  ["DO I HAVE", "TIME TO GRAB", "COFFEE BEFORE", "BOARDING?"],
  ["WHERE IS MY", "AIRLINE'S", "CHECK IN", "COUNTER?"],
] as const;

const HERO_BOARD_COLS = 15;
const HERO_BOARD_ROWS = 8;
const HERO_BOARD_DURATION_S = 1.95;
const HERO_BOARD_CYCLE_MS = 4000;

function formatBoardRow(value: string) {
  const truncated = value.slice(0, HERO_BOARD_COLS);
  const leadingSpaces = Math.ceil((HERO_BOARD_COLS - truncated.length) / 2);
  return `${" ".repeat(leadingSpaces)}${truncated}`.padEnd(HERO_BOARD_COLS, " ");
}

export function HeroStage() {
  const { reducedMotion } = useReducedMotion();
  const [promptIndex, setPromptIndex] = useState(-1);

  const prompt =
    promptIndex === -1 ? AIRPORT_PROMPTS[0] : AIRPORT_PROMPTS[promptIndex];
  const boardRows = useMemo(
    () => ["", "", formatBoardRow(prompt[0]), formatBoardRow(prompt[1]), formatBoardRow(prompt[2]), formatBoardRow(prompt[3]), "", ""],
    [prompt],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const delayTimeout = setTimeout(() => {
      setPromptIndex(0);
    }, 300);
    return () => clearTimeout(delayTimeout);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || promptIndex === -1) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setPromptIndex((idx) => (idx + 1) % AIRPORT_PROMPTS.length);
    }, HERO_BOARD_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, promptIndex]);

  return (
    <section id="hero" aria-labelledby="lp-hero-title">
      <div className="lp-hero-part-static lp-hero-part-aerial">
        <div className="lp-hero-opening">
          <div className="lp-hero-opening-copy">
            <h1 id="lp-hero-title" className="lp-hero-opening-title">
              Simplify the airport experience for every passenger with{" "}
              <span className="lp-hero-infobox-gradient">
                voice intelligence.
              </span>
            </h1>
            <a
              href="#product"
              className="lp-btn lp-btn-primary lp-btn-lg lp-hero-opening-cta"
            >
              Check it out
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
          </div>

          <div className="lp-hero-board-wrap dark" aria-label="Common airport passenger thoughts">
            <div className="lp-hero-board-header" aria-hidden="true">
              <svg
                className="lp-hero-board-header-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M21 16.5v-1.7l-8-5V4.2a1.5 1.5 0 0 0-3 0v5.6l-8 5v1.7l8-2.5v5.5l-2 1.4v1.3l3.5-1 3.5 1v-1.3l-2-1.4V14l8 2.5z"
                  fill="currentColor"
                />
              </svg>
              <span className="lp-hero-board-header-title">Departures</span>
              <span className="lp-hero-board-header-meta">Terminal 1</span>
            </div>
            <div className="lp-hero-board-columns" aria-hidden="true">
              <span>Flight</span>
              <span>Destination</span>
              <span>Sched.</span>
              <span>Gate</span>
              <span>Remarks</span>
            </div>
            <TextFlippingBoard
              rows={boardRows}
              colCount={HERO_BOARD_COLS}
              rowCount={HERO_BOARD_ROWS}
              duration={HERO_BOARD_DURATION_S}
              scrambleSteps={3}
              reducedMotion={reducedMotion}
              className="lp-hero-board"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
