import { useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ButtonColorful } from "../components/ui/button-colorful";
import "lenis/dist/lenis.css";
import "../styles/landing.css";

import { CONVERSION_CONTENT } from "../features/landing/content";
import type { NavItem } from "../features/landing/content";
import { LandingNav } from "../features/landing/components/LandingNav";
import { HeroStage } from "../features/landing/components/HeroStage";
import {
  ProductInfrastructure,
  ProductIntro,
  WhyNodestra,
} from "../features/landing/components/ProductIntro";
import { ProofGrid } from "../features/landing/components/ProofGrid";
import { FaqAccordion } from "../features/landing/components/FaqAccordion";
import { VoiceFeaturesSection } from "../features/landing/components/VoiceFeaturesSection";
import { useLenisScroll } from "../features/landing/hooks/useLenisScroll";
import {
  CurveCarousel,
  type CurveCarouselItem,
} from "../features/landing/components/CurveCarousel";
import { SIGN_IN_PAGE_URL } from "../lib/appConfig";

const CAROUSEL_ITEMS: CurveCarouselItem[] = [
  {
    id: "senior",
    background: "#31405F",
    label: "The senior traveler",
    caption:
      "Nodestra provides clear voice guidance through every turn, removing the need for squinting at signs or navigating complex apps.",
  },
  {
    id: "first-time",
    background: "#4A5278",
    label: "The first-time visitor",
    caption:
      "Nodestra acts as a personal guide via a simple call, ensuring guests never have to waste time downloading a terminal app.",
  },
  {
    id: "non-native",
    background: "#233149",
    label: "The non-native speaker",
    caption:
      "Nodestra instantly switches between 32+ languages, offering helpful support without forcing users to dig through phone settings.",
  },
  {
    id: "accessibility",
    background: "#42506D",
    label: "The wheelchair user",
    caption:
      "Nodestra routes guests via elevators and calls ahead for assistance, all through a reliable and familiar phone interface.",
  },
  {
    id: "low-tech",
    background: "#0F1423",
    label: "The low-tech traveler",
    caption:
      "Nodestra delivers premium navigation through a basic call or text, making it perfect for guests who want to avoid the app store.",
  },
  {
    id: "family",
    background: "#55607E",
    label: "The family with kids",
    caption:
      "Nodestra finds stroller-friendly paths and washrooms hands-free, so parents don't have to fumble with a screen while juggling toddlers.",
  },
  {
    id: "rushed",
    background: "#384764",
    label: "The tight connection",
    caption:
      "Nodestra calculates the fastest route to the next gate instantly, providing live voice directions when there's no time for a map to load.",
  },
  {
    id: "anxious",
    background: "#667095",
    label: "The anxious traveler",
    caption:
      "Nodestra serves as a calm, patient companion on the other end of the line, repeating instructions until the guest feels at ease.",
  },
  {
    id: "business",
    background: "#2B3854",
    label: "The business traveler",
    caption:
      "Nodestra provides heads-up navigation for professionals on the move, allowing them to find lounges or gates without ever looking down at a phone.",
  },
];

export function LandingPage() {
  const pageNavItems = useMemo<NavItem[]>(
    () => [
      { id: "hero", label: "Home" },
      { id: "product", label: "Product" },
      { id: "who", label: "Who" },
      { id: "proof", label: "Benefits" },
      { id: "conversion", label: "Book" },
    ],
    [],
  );

  const openDemo = useCallback(() => {
    window.open("https://calendly.com/patra-ritvik/30min", "_blank", "noopener,noreferrer");
  }, []);

  const { scrollTo } = useLenisScroll();

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      scrollTo(target);
    },
    [scrollTo],
  );

  const overviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="lp lp-snap-root">
      <a
        className="lp-skip"
        href="#lp-overview"
        onClick={(e) => {
          e.preventDefault();
          overviewRef.current?.focus();
          if (overviewRef.current) scrollTo(overviewRef.current);
        }}
      >
        Skip to overview
      </a>

      <p className="sr-only">
        Nodestra is a voice and messaging platform that lets airport passengers
        get navigation, flight updates, and terminal information by phone call
        or text message.
      </p>

      <LandingNav
        items={pageNavItems}
        activeId="hero"
        onSelect={scrollToSection}
        onBookDemo={openDemo}
        progress={0}
        signInHref={SIGN_IN_PAGE_URL}
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
          <ProductIntro />

          <VoiceFeaturesSection />

          <ProductInfrastructure />

          <WhyNodestra />

          <section
            id="who"
            className="lp-snap-section lp-carousel-section"
            aria-labelledby="lp-carousel-title"
          >
            <div className="lp-carousel-head lp-reveal">
              <h2 id="lp-carousel-title" className="lp-product-h2">
                Nodestra's for every passenger, no matter who they are.
              </h2>
            </div>
            <CurveCarousel
              items={CAROUSEL_ITEMS}
              radius={510}
              cardHeight={360}
              tileWidth={370}
              perspective={860}
              cameraOffset={140}
              gap={14}
              maxVisibleAngle={118}
            />
          </section>

          <ProofGrid />

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
              <a
                href={SIGN_IN_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-ghost lp-btn-lg lp-btn-ghost-inv"
              >
                {CONVERSION_CONTENT.secondaryCta}
              </a>
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
              Voice and messaging guidance for airport passengers.
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
                <li><a href={SIGN_IN_PAGE_URL} target="_blank" rel="noopener noreferrer">Sign In</a></li>
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
