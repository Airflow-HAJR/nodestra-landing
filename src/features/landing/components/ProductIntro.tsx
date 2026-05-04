type ProductPoint = {
  id: string;
  title: string;
  body: string;
};

const INFRASTRUCTURE_POINTS: ProductPoint[] = [
  {
    id: "existing",
    title: "Already have an existing wayfinding system?",
    body: "Nodestra can layer on top of your existing platform — like Mappedin or others — and seamlessly turn that data into conversations through your voice AI agent.",
  },
  {
    id: "owned",
    title: "Don't have a map yet?",
    body: "No problem. The Nodestra team will build a proprietary mapping system for your entire airport, then connect it to your existing flight tracking and terminal information.",
  },
];

export function ProductIntro() {
  return (
    <section
      id="product"
      className="lp-product lp-snap-section"
      aria-labelledby="lp-product-title"
    >
      <div className="lp-product-inner">
        <div className="lp-product-head lp-reveal">
          <h2 id="lp-product-title" className="lp-product-h2">
            What is{" "}
            <span className="lp-product-wordmark">
              nodestra<span className="lp-product-period">.</span>
            </span>
            ?
          </h2>
        </div>

        <div className="lp-product-definition lp-reveal">
          <div className="lp-product-definition-copy">
            <span className="lp-product-definition-label">The product</span>
            <p>
              Nodestra is a <strong>voice and messaging platform</strong> for
              airport passengers. It gives navigation, flight updates, and
              terminal answers through a simple{" "}
              <strong>phone call or text message</strong>.
            </p>
          </div>
          <div className="lp-product-conversation" aria-label="Example Nodestra conversation">
            <div className="lp-product-bubble lp-product-bubble-from">
              <span className="lp-product-bubble-tag">Passenger</span>
              <p>"Where's the closest restaurant to Gate A4?"</p>
            </div>
            <div className="lp-product-bubble lp-product-bubble-to">
              <span className="lp-product-bubble-tag">Nodestra</span>
              <p>
                "Turn left toward the moving walkway. Sky Bistro is on your
                right in about 80 metres. I can keep guiding you as you walk."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyNodestra() {
  return (
    <section
      id="why"
      className="lp-product lp-snap-section"
      aria-labelledby="lp-why-title"
    >
      <div className="lp-product-inner">
        <div className="lp-why-block lp-reveal">
          <div className="lp-why-headline">
            <h3 id="lp-why-title" className="lp-why-eyebrow">Why Nodestra?</h3>
            <p className="lp-why-title">
              Nobody wants to download an app or open a finicky website just
              for the airport. But every single traveler already knows how to
              make a phone call or send a text.
            </p>
          </div>

          <dl className="lp-why-arg">
            <div className="lp-why-arg-item">
              <dt className="lp-why-arg-label">For the passenger</dt>
              <dd>
                A text or a call gets them an answer. No app to download, no
                account to create, no interface to learn.
              </dd>
            </div>
            <div className="lp-why-arg-item">
              <dt className="lp-why-arg-label">For the airport</dt>
              <dd>
                Nothing new to install. Nodestra connects to the wayfinding,
                flight, and terminal systems you already run.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function ProductInfrastructure() {
  return (
    <section
      id="infrastructure"
      className="lp-product lp-snap-section"
      aria-labelledby="lp-infrastructure-title"
    >
      <div className="lp-product-inner">
        <h2 id="lp-infrastructure-title" className="sr-only">
          Wayfinding and mapping
        </h2>

        <div className="lp-product-infra lp-reveal">
          <article className="lp-product-infra-card">
            <span className="lp-product-infra-num">01</span>
            <h3>{INFRASTRUCTURE_POINTS[0].title}</h3>
            <p>{INFRASTRUCTURE_POINTS[0].body}</p>
          </article>
          <div className="lp-product-infra-or" aria-hidden="true">or</div>
          <article className="lp-product-infra-card">
            <span className="lp-product-infra-num">02</span>
            <h3>{INFRASTRUCTURE_POINTS[1].title}</h3>
            <p>{INFRASTRUCTURE_POINTS[1].body}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
