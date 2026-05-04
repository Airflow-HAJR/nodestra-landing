type ForThemItem = { value: string; unit: string; label: string; darkUnit?: boolean };

const FOR_THEM: ForThemItem[] = [
  { value: "12+", unit: "", label: "languages supported for international passengers." },
  { value: "4s", unit: "", label: "between a flight update and passenger notification." },
  { value: "0", unit: "", label: "apps to download. Just a phone call.", darkUnit: true },
];

const FOR_YOU = [
  {
    id: "revenue",
    value: "+$Millions",
    label: "More revenue",
    description:
      "Satisfied passengers spend $16 more at your terminal. Confusing airports miss out on that.",
  },
  {
    id: "analytics",
    value: "Clarity",
    label: "Analytics",
    description:
      "Determine exactly where passengers get lost and fix the friction before it compounds.",
  },
  {
    id: "efficiency",
    value: "Free",
    label: "Efficiency",
    description:
      "Route every basic query to voice. Your staff handles the work only humans can do.",
  },
  {
    id: "accessibility",
    value: "ADA",
    label: "Accessibility",
    description:
      "Language equity, ADA, and international accessibility standards, met by default.",
  },
] as const;

export function ProofGrid() {
  return (
    <section
      id="proof"
      className="lp-proof lp-snap-section"
      aria-labelledby="lp-proof-title"
    >
      <div className="lp-proof-inner">
        <div className="lp-proof-head lp-reveal">
          <div className="lp-proof-head-copy">
            <h2 id="lp-proof-title" className="lp-proof-h2">
              Benefits, by the numbers
            </h2>
          </div>
        </div>

        <div className="lp-proof-section-label">For passengers</div>

        <div className="lp-proof-headline lp-reveal">
          {FOR_THEM.map((m) => (
            <div key={m.label} className="lp-proof-headline-item">
              <div className="lp-proof-headline-value">
                <span className="lp-proof-headline-number">{m.value}</span>
                {m.unit && (
                  <span
                    className={`lp-proof-headline-unit${m.darkUnit ? " lp-proof-headline-unit--dark" : ""}`}
                  >
                    {m.unit}
                  </span>
                )}
              </div>
              <span className="lp-proof-headline-label">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="lp-proof-section-label lp-proof-section-label--you">For airports</div>

        <div className="lp-proof-pillars lp-reveal">
          {FOR_YOU.map((card) => (
            <article key={card.id} className="lp-proof-pillar">
              <div className="lp-proof-pillar-top">
                <span className="lp-proof-pillar-value">{card.value}</span>
                <span className="lp-proof-pillar-label">{card.label}</span>
              </div>
              <p className="lp-proof-pillar-desc">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
