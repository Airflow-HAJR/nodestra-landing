import { useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ButtonColorful } from "../components/ui/button-colorful";
import "../styles/landing.css";

import { CONVERSION_CONTENT } from "../features/landing/content";
import type { NavItem } from "../features/landing/content";
import { LandingNav } from "../features/landing/components/LandingNav";
import { HeroStage } from "../features/landing/components/HeroStage";
import { ProofGrid } from "../features/landing/components/ProofGrid";
import { FaqAccordion } from "../features/landing/components/FaqAccordion";

export function LandingPage() {
  const pageNavItems = useMemo<NavItem[]>(
    () => [
      { id: "hero", label: "Home" },
      { id: "product", label: "Product" },
      { id: "proof", label: "Benefits" },
      { id: "conversion", label: "Book" },
    ],
    [],
  );

  const openDemo = useCallback(() => {
    window.open("https://calendly.com/patra-ritvik/nodestra-meeting", "_blank", "noopener,noreferrer");
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
  }, []);

  const overviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="lp lp-snap-root">
      <a
        className="lp-skip"
        href="#lp-overview"
        onClick={(e) => {
          e.preventDefault();
          overviewRef.current?.focus();
          overviewRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Skip to overview
      </a>

      <p className="sr-only">
        Nodestra is an airport operations platform combining live flight data, a
        visual map editor, and voice-first passenger wayfinding.
      </p>

      <LandingNav
        items={pageNavItems}
        activeId="hero"
        onSelect={scrollToSection}
        onBookDemo={openDemo}
        progress={0}
      />

      <main>
        <HeroStage />
        <div
          id="lp-overview"
          ref={overviewRef}
          tabIndex={-1}
          aria-label="Overview"
        />

        <div className="lp-content-floor">
        <div id="product">
          <div className="lp-funded-banner">
            <span className="lp-funded-banner-text">Proudly built with voice AI industry leaders</span>
            <img src="/elevenlabs-logo.png" alt="ElevenLabs" className="lp-funded-logo lp-funded-logo-elevenlabs" />
            <img src="/vapi-logo.svg" alt="Vapi" className="lp-funded-logo lp-funded-logo-vapi" />
          </div>

          <ProofGrid />
        </div>
        <FaqAccordion />

        <section className="lp-stat-strip lp-snap-section" aria-labelledby="lp-stat-title">
          <div className="lp-stat-strip-inner lp-reveal">
            <div className="lp-stat-left">
              <div className="lp-stat-value">
                <span className="lp-stat-number">3.8</span>
                <span className="lp-stat-divisor">/10</span>
              </div>
              <p className="lp-stat-citation">
                <em>Source: ScienceDirect</em>
              </p>
            </div>
            <div className="lp-stat-copy">
              <p id="lp-stat-title" className="lp-stat-text">
                is the average national passenger satisfaction score at airports.
              </p>
              <div className="lp-stat-secondary-row">
                <p className="lp-stat-secondary">
                  But yours doesn't have to be that low.
                </p>
                <span className="lp-stat-gradient">Just choose Nodestra.</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="conversion"
          className="lp-conversion lp-snap-section"
          aria-labelledby="lp-conversion-title"
        >
          <div className="lp-conversion-body lp-reveal">
            <h2 id="lp-conversion-title" className="lp-conversion-h2">
              {CONVERSION_CONTENT.title}
            </h2>
            <p className="lp-conversion-lede">{CONVERSION_CONTENT.sub}</p>

            <div className="lp-conversion-cta-row">
              <ButtonColorful
                label={CONVERSION_CONTENT.primaryCta}
                onClick={openDemo}
                className="!h-12 !px-8 !text-[15px]"
              />
              <Link
                to="/sign-in"
                className="lp-btn lp-btn-ghost lp-btn-lg lp-btn-ghost-inv"
              >
                {CONVERSION_CONTENT.secondaryCta}
              </Link>
            </div>


          </div>
        </section>
        </div>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div className="lp-footer-lockup">
              <svg className="lp-footer-mark" viewBox="0 0 1964.55 1573.48" aria-hidden="true">
                <path fill="currentColor" d="M243.84,786.74c0-393.04,288.21-718.75,664.82-777.34-39.74-6.18-80.45-9.4-121.92-9.4C352.24,0,0,352.24,0,786.74s352.24,786.74,786.74,786.74c41.47,0,82.19-3.22,121.92-9.4-376.61-58.59-664.82-384.31-664.82-777.34Z"/>
                <circle fill="currentColor" cx="1177.81" cy="786.74" r="786.74"/>
              </svg>
              <span className="lp-footer-wordmark">nodestra<span className="lp-footer-period">.</span></span>
            </div>
            <p className="lp-footer-tag">
              The operating system for airport operations.
            </p>
          </div>

          <div className="lp-footer-divider" />

          <div className="lp-footer-grid">
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Product</div>
              <ul>
                <li><a href="#hero">Voice Wayfinding</a></li>
                <li><a href="#proof">System Proof</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#conversion">Book Demo</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Company</div>
              <ul>
                <li><a href="mailto:hello@nodestra.com">Contact</a></li>
                <li><button type="button" onClick={openDemo}>Book Demo</button></li>
                <li><Link to="/sign-in">Sign In</Link></li>
                <li><Link to="/create-account">Create Account</Link></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Legal</div>
              <ul>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span>&copy; {new Date().getFullYear()} Nodestra</span>
          <span>Built for airport operations teams.</span>
        </div>
      </footer>

    </div>
  );
}
