import type { LandingChapter } from "../types";
import { ChapterVisual } from "./ChapterVisual";

type Props = {
  chapter: LandingChapter;
  index: number;
  isActive: boolean;
};

export function StoryChapter({ chapter, index, isActive }: Props) {
  const flipped = index % 2 === 1;
  const chapterNum = String(index + 1).padStart(2, "0");
  const totalChapters = "04";

  return (
    <section
      id={chapter.id}
      className={`lp-chapter lp-snap-section ${flipped ? "is-flipped" : ""} ${isActive ? "is-active" : ""}`}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="lp-chapter-ambient" aria-hidden="true">
        <span className="lp-chapter-ambient-glow" />
        <span className="lp-chapter-ambient-ring" />
      </div>

      <div className="lp-chapter-stage">
        <div className="lp-chapter-text lp-reveal">
          <div className="lp-chapter-meta">
            <span className="lp-chapter-counter" aria-hidden="true">
              <span className="lp-chapter-counter-now">{chapterNum}</span>
              <span className="lp-chapter-counter-sep">/</span>
              <span className="lp-chapter-counter-total">{totalChapters}</span>
            </span>
            <span className="lp-eyebrow lp-chapter-eyebrow">
              {chapter.eyebrow}
            </span>
          </div>

          <h2 id={`${chapter.id}-title`} className="lp-chapter-title">
            {chapter.title}
          </h2>

          {chapter.caption && (
            <p className="lp-chapter-caption">{chapter.caption}</p>
          )}

          <div className="lp-chapter-dialogue">
            <div className="lp-chapter-prompt">
              <span className="lp-chapter-prompt-label">Passenger says</span>
              <p className="lp-chapter-prompt-text">{chapter.command}</p>
            </div>
            <div className="lp-chapter-response">
              <span className="lp-chapter-response-label">
                Nodestra responds
              </span>
              <p className="lp-chapter-response-text">{chapter.response}</p>
            </div>
          </div>

          <p className="lp-chapter-copy">{chapter.copy}</p>

          <div
            className="lp-chapter-stats"
            role="list"
            aria-label={`${chapter.title} metrics`}
          >
            {chapter.stats.map((stat) => (
              <span
                key={stat.label}
                className="lp-chapter-stat"
                role="listitem"
              >
                <span className="lp-chapter-stat-value">{stat.value}</span>
                <span className="lp-chapter-stat-label">{stat.label}</span>
                {stat.delta && (
                  <span className="lp-chapter-stat-delta">{stat.delta}</span>
                )}
              </span>
            ))}
          </div>

          <div className="lp-chapter-rail" role="list">
            {chapter.moments.map((m, momentIndex) => (
              <span key={m.id} className="lp-chapter-rail-item" role="listitem">
                <span className="lp-chapter-rail-index" aria-hidden="true">
                  {String(momentIndex + 1).padStart(2, "0")}
                </span>
                <span className="lp-chapter-rail-copy">
                  <span className="lp-chapter-rail-dot" aria-hidden="true" />
                  <span className="lp-chapter-rail-label">{m.label}</span>
                  <span className="lp-chapter-rail-caption">{m.caption}</span>
                </span>
              </span>
            ))}
          </div>

          <p className="sr-only">{chapter.copy}</p>
        </div>

        <aside className="lp-chapter-visual lp-reveal" aria-hidden="true">
          <ChapterVisual id={chapter.id} isActive={isActive} />
        </aside>
      </div>
    </section>
  );
}
