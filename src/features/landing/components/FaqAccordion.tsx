import { useState } from "react";
import { FAQ_ITEMS } from "../content";
import { VoiceOrb } from "./VoiceOrb";

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section
      id="faq"
      className="lp-faq lp-snap-section"
      aria-labelledby="lp-faq-title"
    >
      <div className="lp-faq-inner">
        <div className="lp-faq-side lp-reveal">
          <span className="lp-eyebrow">Getting Started</span>
          <h2 id="lp-faq-title" className="lp-section-h2">
            Three easy steps.
          </h2>
          <p className="lp-faq-head-sub">
            From the development of your Nodestra agent to its deployment and optimization, we work closely with your team at every stage.
          </p>

          <div className="lp-faq-voice-card">
            <VoiceOrb size="sm" phase="listening" />
            <div className="lp-faq-voice-copy">
              <span className="lp-faq-voice-kicker">Assistant state</span>
              <span className="lp-faq-voice-title">
                Ready for passenger calls and ops questions.
              </span>
            </div>
          </div>

        </div>

        <dl className="lp-faq-list lp-reveal">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="lp-faq-item" data-open={isOpen}>
                <dt>
                  <button
                    type="button"
                    className="lp-faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    id={`${item.id}-trigger`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span className="lp-faq-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="lp-faq-q">{item.question}</span>
                    <span className="lp-faq-trigger-icon" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-trigger`}
                  className="lp-faq-panel"
                >
                  <div className="lp-faq-body">{item.answer}</div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
