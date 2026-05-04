"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";

const BOARD_ROWS = 7;
const BOARD_COLS = 22;

const BASE_COL_DELAY = 30;
const BASE_ROW_DELAY = 20;
const BASE_STEP_MS = 55;
const BASE_FLIP_S = 0.35;
const BASE_SCRAMBLE_STEPS = 4;
const BASE_TOTAL_S =
  ((BOARD_COLS - 1) * BASE_COL_DELAY +
    (BOARD_ROWS - 1) * BASE_ROW_DELAY +
    8 * BASE_STEP_MS) /
  1000;

type AccentColor = {
  top: string;
  bottom: string;
  text: string;
};

const ACCENT_COLORS: AccentColor[] = [
  { top: "bg-red-600", bottom: "bg-red-700", text: "text-white" },
  { top: "bg-orange-500", bottom: "bg-orange-600", text: "text-white" },
  { top: "bg-yellow-400", bottom: "bg-yellow-500", text: "text-neutral-900" },
  { top: "bg-green-600", bottom: "bg-green-700", text: "text-white" },
  { top: "bg-blue-600", bottom: "bg-blue-700", text: "text-white" },
  { top: "bg-violet-600", bottom: "bg-violet-700", text: "text-white" },
  { top: "bg-white", bottom: "bg-neutral-100", text: "text-neutral-900" },
];

function normalizeTarget(value: string) {
  const normalized = value.toUpperCase();
  return FLAP_CHARS.includes(normalized) ? normalized : " ";
}

const CELL_TEXT_STYLE: React.CSSProperties = {
  fontSize: "var(--flip-cell-font-size, clamp(20px, 2.6vw, 42px))",
  lineHeight: 1,
};

// ── Individual Split-Flap Character ───────────────────────────────────

const FlapCell = React.memo(function FlapCell({
  target,
  delay,
  stepMs,
  flipDuration,
  scrambleSteps,
  reducedMotion,
}: {
  target: string;
  delay: number;
  stepMs: number;
  flipDuration: number;
  scrambleSteps: number;
  reducedMotion: boolean;
}) {
  const initialTarget = normalizeTarget(target);
  const [current, setCurrent] = useState(initialTarget);
  const [prev, setPrev] = useState(initialTarget);
  const [flipId, setFlipId] = useState(0);
  const [accent, setAccent] = useState<AccentColor | null>(null);
  const [prevAccent, setPrevAccent] = useState<AccentColor | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const curRef = useRef(initialTarget);
  const tgtRef = useRef<string | null>(initialTarget);
  const accentRef = useRef<AccentColor | null>(null);
  const isFlippingRef = useRef(false);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (startTimer.current) clearTimeout(startTimer.current);
    if (stepTimer.current) clearTimeout(stepTimer.current);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    startTimer.current = null;
    stepTimer.current = null;
    settleTimer.current = null;

    const normalized = normalizeTarget(target);
    if (normalized === tgtRef.current) return;
    tgtRef.current = normalized;

    if (normalized === curRef.current) return;

    if (reducedMotion || scrambleSteps === 0) {
      setPrev(curRef.current);
      setPrevAccent(accentRef.current);
      curRef.current = normalized;
      accentRef.current = null;
      setCurrent(normalized);
      setAccent(null);
      setPrevAccent(null);
      return;
    }

    const markFlipping = () => {
      if (!isFlippingRef.current) {
        isFlippingRef.current = true;
        setIsFlipping(true);
      }

      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => {
        isFlippingRef.current = false;
        setIsFlipping(false);
      }, (flipDuration * 1.35 + flipDuration * 0.5) * 1000 + 80);
    };

    const extraSteps = normalized.charCodeAt(0) % 3;
    const scrambleCount =
      normalized === " "
        ? Math.min(2, scrambleSteps)
        : scrambleSteps + extraSteps;

    const runStep = (i: number) => {
      const isLast = i === scrambleCount;
      const ch = isLast
        ? normalized
        : FLAP_CHARS[1 + Math.floor(Math.random() * (FLAP_CHARS.length - 1))];

      const newAccent = isLast
        ? null
        : Math.random() < 0.2
          ? ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
          : null;

      setPrev(curRef.current);
      setPrevAccent(accentRef.current);
      curRef.current = ch;
      accentRef.current = newAccent;
      setCurrent(ch);
      setAccent(newAccent);
      setFlipId((n) => n + 1);
      markFlipping();

      if (!isLast) {
        stepTimer.current = setTimeout(() => runStep(i + 1), stepMs);
      }
    };

    startTimer.current = setTimeout(() => runStep(1), delay);

    return () => {
      if (startTimer.current) clearTimeout(startTimer.current);
      if (stepTimer.current) clearTimeout(stepTimer.current);
      if (settleTimer.current) clearTimeout(settleTimer.current);
      startTimer.current = null;
      stepTimer.current = null;
      settleTimer.current = null;
    };
  }, [target, delay, stepMs, flipDuration, scrambleSteps, reducedMotion]);

  const show = current === " " ? "\u00A0" : current;
  const showPrev = prev === " " ? "\u00A0" : prev;

  const textCx =
    "absolute inset-x-0 flex select-none items-center justify-center font-mono font-bold tracking-wide";
  const topBg = accent?.top ?? "bg-neutral-200/80 dark:bg-neutral-900";
  const bottomBg = accent?.bottom ?? "bg-neutral-200/80 dark:bg-neutral-900";
  const textColor = accent?.text ?? "text-neutral-800 dark:text-white";

  const flapTopBg = prevAccent?.top ?? "bg-neutral-100 dark:bg-neutral-800";
  const flapTextColor = prevAccent?.text ?? "text-neutral-800 dark:text-white";

  const bottomDelay = flipDuration * 0.5;

  return (
    <div className="flex aspect-3/6 flex-col overflow-hidden rounded-[2px] border border-neutral-300 md:rounded-[3px] md:border-2 dark:border-black">
      {/* Flap content area */}
      <div className="relative flex-1 perspective-dramatic transform-3d">
        <div className="absolute inset-0 z-40 hidden flex-row items-center justify-center md:flex">
          <div className="h-1/2 w-px rounded-tr-sm rounded-br-sm bg-neutral-300 dark:bg-black" />
          <div className="flex h-px flex-1 bg-neutral-300 dark:bg-black" />
          <div className="h-1/2 w-px rounded-tl-sm rounded-bl-sm bg-neutral-300 dark:bg-black" />
        </div>

        {/* Static top – new character top half */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[calc(50%-0.5px)] overflow-hidden rounded-t-[3px]",
            topBg,
          )}
        >
          <div
            className={cn(textCx, textColor, "top-0 h-[200%]")}
            style={CELL_TEXT_STYLE}
          >
            {show}
          </div>
        </div>

        {/* Static bottom – new character bottom half */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-[calc(50%-0.5px)] overflow-hidden rounded-b-[3px]",
            bottomBg,
          )}
        >
          <div
            className={cn(textCx, textColor, "bottom-0 h-[200%]")}
            style={CELL_TEXT_STYLE}
          >
            {show}
          </div>
          {isFlipping && (
            <motion.div
              key={`s${flipId}`}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.8),transparent_60%)] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),transparent_60%)]"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{ duration: flipDuration * 1.3, ease: "easeOut" }}
            />
          )}
        </div>

        {/* Flipping top flap – old character top half, drops down */}
        {isFlipping && (
          <motion.div
            key={flipId}
            className={cn(
              "absolute inset-x-0 top-0 z-10 h-[calc(50%-0.5px)] origin-bottom overflow-hidden rounded-t-[3px] backface-hidden transform-3d",
              flapTopBg,
            )}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -100 }}
            transition={{
              duration: flipDuration,
              ease: [0.55, 0.055, 0.675, 0.19],
            }}
          >
            <div
              className={cn(textCx, flapTextColor, "top-0 h-[200%]")}
              style={CELL_TEXT_STYLE}
            >
              {showPrev}
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,1))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,1))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: flipDuration }}
            />
          </motion.div>
        )}

        {/* Flipping bottom flap – new character bottom half, rises up */}
        {isFlipping && (
          <motion.div
            key={`b${flipId}`}
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 h-[calc(50%-0.5px)] origin-top overflow-hidden rounded-b-[3px] backface-hidden transform-3d",
              bottomBg,
            )}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{
              duration: flipDuration * 0.85,
              delay: bottomDelay,
              ease: [0.33, 1.55, 0.64, 1],
            }}
          >
            <div
              className={cn(textCx, textColor, "bottom-0 h-[200%]")}
              style={CELL_TEXT_STYLE}
            >
              {show}
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0),rgba(255,255,255,0.6))] dark:bg-[linear-gradient(to_top,rgba(0,0,0,0),rgba(0,0,0,0.6))]"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: flipDuration * 0.85,
                delay: bottomDelay,
              }}
            />
          </motion.div>
        )}

        {/* Split line */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-[0.5px] bg-neutral-400/50 dark:bg-black/50" />
      </div>

      {/* Bottom stripes – decorative, outside the flap area */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(to_bottom,currentColor_0,currentColor_1px,transparent_1px,transparent_0.15rem)] mask-t-from-50% text-neutral-400 opacity-20 md:h-4 md:bg-[repeating-linear-gradient(to_bottom,currentColor_0,currentColor_1px,transparent_1px,transparent_0.2rem)] dark:text-black dark:opacity-100" />
    </div>
  );
},
(prevProps, nextProps) =>
  prevProps.target === nextProps.target &&
  prevProps.delay === nextProps.delay &&
  prevProps.stepMs === nextProps.stepMs &&
  prevProps.flipDuration === nextProps.flipDuration &&
  prevProps.scrambleSteps === nextProps.scrambleSteps &&
  prevProps.reducedMotion === nextProps.reducedMotion,
);

// ── Color Tile ────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  "{R}": "#D32F2F",
  "{O}": "#F57C00",
  "{Y}": "#FBC02D",
  "{G}": "#43A047",
  "{B}": "#1E88E5",
  "{V}": "#8E24AA",
  "{W}": "#FAFAFA",
};

const ColorCell = React.memo(function ColorCell({ color }: { color: string }) {
  return (
    <div
      className="aspect-3/5 rounded-[3px] border-2 border-neutral-300 dark:border-black"
      style={{ backgroundColor: color }}
    />
  );
});

// ── Row Parser ────────────────────────────────────────────────────────

type ParsedCell =
  | { type: "char"; value: string }
  | { type: "color"; hex: string };

function parseRow(row: string): ParsedCell[] {
  const cells: ParsedCell[] = [];
  let i = 0;
  while (i < row.length) {
    if (row[i] === "{" && i + 2 < row.length && row[i + 2] === "}") {
      const code = row.substring(i, i + 3);
      if (COLOR_MAP[code]) {
        cells.push({ type: "color", hex: COLOR_MAP[code] });
        i += 3;
        continue;
      }
    }
    cells.push({ type: "char", value: row[i] });
    i++;
  }
  return cells;
}

// ── Word Wrap ─────────────────────────────────────────────────────────

function wrapParagraph(paragraph: string, maxCols: number): string[] {
  const lines: string[] = [];
  const words = paragraph.split(/[ \t]+/).filter(Boolean);
  let currentLine = "";

  for (const word of words) {
    if (word.length > maxCols) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }
      lines.push(word.slice(0, maxCols));
      continue;
    }

    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxCols) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function wrapText(input: string, maxCols: number): string[] {
  return input
    .split("\n")
    .flatMap((paragraph) =>
      paragraph.trim() === "" ? [""] : wrapParagraph(paragraph, maxCols),
    );
}

// ── Main TextFlippingBoard Component ──────────────────────────────────

export interface TextFlippingBoardProps {
  rows?: string[];
  text?: string;
  className?: string;
  colCount?: number;
  rowCount?: number;
  /** Total animation duration in seconds. Defaults to ~1.2s. */
  duration?: number;
  /** Maximum split-flap scramble ticks per changed character. */
  scrambleSteps?: number;
  /** Render target text directly without flip animations. */
  reducedMotion?: boolean;
}

export function TextFlippingBoard({
  rows,
  text,
  className,
  colCount = BOARD_COLS,
  rowCount = BOARD_ROWS,
  duration = BASE_TOTAL_S,
  scrambleSteps = BASE_SCRAMBLE_STEPS,
  reducedMotion = false,
}: TextFlippingBoardProps) {
  const activeRows = Math.max(1, Math.min(BOARD_ROWS, rowCount));
  const activeCols = Math.max(1, Math.min(BOARD_COLS, colCount));
  const scale = duration / BASE_TOTAL_S;
  const colDelay = BASE_COL_DELAY * scale;
  const rowDelay = BASE_ROW_DELAY * scale;
  const stepMs = BASE_STEP_MS * scale;
  const flipDur = Math.min(0.6, Math.max(0.15, BASE_FLIP_S * scale));
  const cappedScrambleSteps = reducedMotion
    ? 0
    : Math.max(0, Math.min(8, Math.round(scrambleSteps)));

  const board = useMemo(() => {
    const grid: ParsedCell[][] = Array.from({ length: activeRows }, () =>
      Array.from({ length: activeCols }, () => ({
        type: "char" as const,
        value: " ",
      })),
    );

    if (text) {
      const lines = wrapText(text, activeCols).slice(0, activeRows);
      const startRow = Math.max(0, Math.floor((activeRows - lines.length) / 2));
      lines.forEach((line, i) => {
        const row = startRow + i;
        if (row >= activeRows) return;
        const parsed = parseRow(line);
        const startCol = Math.max(
          0,
          Math.floor((activeCols - parsed.length) / 2),
        );
        parsed.forEach((cell, c) => {
          if (startCol + c < activeCols) {
            grid[row][startCol + c] = cell;
          }
        });
      });
    } else if (rows) {
      rows.forEach((row, r) => {
        if (r >= activeRows) return;
        const parsed = parseRow(row);
        parsed.forEach((cell, c) => {
          if (c < activeCols) {
            grid[r][c] = cell;
          }
        });
      });
    }

    return grid;
  }, [activeCols, activeRows, rows, text]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl rounded-xl bg-neutral-100 p-2 shadow-xl md:rounded-2xl md:p-4 dark:bg-neutral-900 dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div
        className="grid gap-px md:gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${activeCols}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) =>
            cell.type === "color" ? (
              <ColorCell key={`${r}-${c}`} color={cell.hex} />
            ) : (
              <FlapCell
                key={`${r}-${c}`}
                target={cell.value}
                delay={c * colDelay + r * rowDelay}
                stepMs={stepMs}
                flipDuration={flipDur}
                scrambleSteps={cappedScrambleSteps}
                reducedMotion={reducedMotion}
              />
            ),
          ),
        )}
      </div>
    </div>
  );
}
