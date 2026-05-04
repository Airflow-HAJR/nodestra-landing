import type {
  LandingChapter,
  ProofCard,
  FaqItem,
  ChapterMetric,
} from "./types";

export const HERO_CONTENT = {
  eyebrow: "Voice-first airport navigation",
  title: "Just ask.\nWe'll get you there.",
  sub: "Passengers call a number and hear turn-by-turn directions in their language: no app, no login, no screen. Nodestra maps your terminal, monitors every gate, and guides every passenger by voice.",
  primaryCta: "Book Demo",
  secondaryCta: "Explore the platform",
};

export const CHAPTERS: LandingChapter[] = [
  {
    id: "voice",
    eyebrow: "Chapter 1",
    title: "It answers any phone.",
    caption:
      "A dial tone. A voice. Turn-by-turn directions in the passenger's language.",
    copy: "Passengers do not need to learn your airport. They ask in plain language, and Nodestra responds with spoken, step-by-step directions that update mid-walk when the terminal changes.",
    command: '"I just landed. How do I get to baggage claim?"',
    response:
      "Nodestra understands the ask, identifies the passenger context, and starts speaking the route back in seconds.",
    stats: [
      { label: "Languages", value: "12+", delta: "same flow, localized voice" },
      {
        label: "Passenger side",
        value: "0 apps",
        delta: "works from any phone",
      },
      {
        label: "Route refresh",
        value: "< 4s",
        delta: "if the journey changes",
      },
    ],
    accent: "#4338CA",
    moments: [
      {
        id: "voice-1",
        label: "Ask",
        at: 0.16,
        caption: '"Where is gate C22?" Natural phrasing, zero training.',
        srSummary: "Passengers ask for their destination in natural language.",
      },
      {
        id: "voice-2",
        label: "Understand",
        at: 0.28,
        caption:
          "Intent, language, and accessibility constraints resolved instantly.",
        srSummary:
          "Intent, preferred language, and accessibility constraints are resolved instantly.",
      },
      {
        id: "voice-3",
        label: "Guide",
        at: 0.42,
        caption:
          "The assistant speaks every turn, then re-routes live if the airport shifts.",
        srSummary:
          "The assistant narrates the route and re-routes live if the airport shifts.",
      },
    ],
  },
  {
    id: "live-intel",
    eyebrow: "Chapter 2",
    title: "It hears the terminal.",
    caption:
      "A live pulse of every gate, every flight, every queue — updated in seconds.",
    copy: "Behind the voice is a live operating picture. Nodestra watches the terminal the way a tower watches the airspace, so every spoken answer reflects what is true in real time.",
    command: '"What changed in Terminal C?"',
    response:
      "Live feeds, passenger density, and desk-level alerts are fused into one voice-ready state model.",
    stats: [
      { label: "Feed latency", value: "1.8s", delta: "p95 end-to-end" },
      {
        label: "Update cadence",
        value: "4s",
        delta: "fresh flight board state",
      },
      { label: "Coverage", value: "100%", delta: "gates, queues, checkpoints" },
    ],
    accent: "#2A4A5E",
    moments: [
      {
        id: "live-intel-1",
        label: "Pulse",
        at: 0.54,
        caption: "Continuous flight feed. 4s refresh. No stale gate data.",
        srSummary:
          "Live flight feed updates every four seconds, ensuring gate data is never stale.",
      },
      {
        id: "live-intel-2",
        label: "Density",
        at: 0.64,
        caption: "Passenger load by zone. Surge detection before queues form.",
        srSummary:
          "Passenger density per zone is tracked so surges are detected before queues form.",
      },
      {
        id: "live-intel-3",
        label: "Signal",
        at: 0.74,
        caption: "Ops alerts routed to the exact desk that owns them.",
        srSummary:
          "Operational alerts are routed to the desk responsible for that area.",
      },
    ],
  },
  {
    id: "gate-recovery",
    eyebrow: "Chapter 3",
    title: "It adapts in seconds.",
    caption:
      "Gate moves from C04 to E17 — 212 passengers already walking the new route.",
    copy: "A disruption is not just a red badge on a screen. Nodestra detects the change, recalculates the route, and updates the spoken guidance before passengers reach the wrong concourse.",
    command: '"Flight BA287 moved. Who is affected?"',
    response:
      "Nodestra isolates impacted passengers, computes the new path, and pushes the new voice flow automatically.",
    stats: [
      {
        label: "Detect → dispatch",
        value: "3.4s",
        delta: "gate move to passenger update",
      },
      {
        label: "Passengers rerouted",
        value: "212",
        delta: "on a single flight event",
      },
      {
        label: "Missed handoffs",
        value: "0",
        delta: "when the voice loop stays active",
      },
    ],
    accent: "#1F3A4C",
    moments: [
      {
        id: "recovery-1",
        label: "Detect",
        at: 0.82,
        caption: "Airline feed flags a gate reassignment in ≤ 2 seconds.",
        srSummary:
          "Gate reassignments are detected from the airline feed within two seconds.",
      },
      {
        id: "recovery-2",
        label: "Reroute",
        at: 0.9,
        caption: "Passenger-specific route recomputed around the new gate.",
        srSummary:
          "A passenger-specific route to the new gate is recomputed automatically.",
      },
      {
        id: "recovery-3",
        label: "Notify",
        at: 0.96,
        caption: "Silent push + voice handoff. No app required.",
        srSummary:
          "Affected passengers get a silent push notification and a voice handoff, with no app install required.",
      },
    ],
  },
  {
    id: "map-builder",
    eyebrow: "Chapter 4",
    title: "It knows every corner.",
    caption:
      "Drop a floor plan. Trace corridors. Ship a walkable graph in a single shift.",
    copy: "The voice assistant is only as good as the map beneath it. Nodestra turns a floor plan into a walkable graph fast, so spoken directions stay precise down to the corridor and escalator.",
    command: '"Map a new concourse before tomorrow morning."',
    response:
      "Operators trace the path once, tag the landmarks, and the routing engine is ready without a new deploy.",
    stats: [
      {
        label: "Setup time",
        value: "< 1 day",
        delta: "single-terminal airports",
      },
      { label: "Graph export", value: "JSON", delta: "router-ready output" },
      {
        label: "Operator effort",
        value: "1 shift",
        delta: "no CAD team required",
      },
    ],
    accent: "#2A4A5E",
    moments: [
      {
        id: "map-1",
        label: "Trace",
        at: 0.97,
        caption: "Click corridors into a graph. Edges auto-weight in metres.",
        srSummary:
          "Corridors are traced into a graph and edges are auto-weighted in metres.",
      },
      {
        id: "map-2",
        label: "Tag",
        at: 0.985,
        caption:
          "Pin POIs with keywords. Projection snaps them to the nearest edge.",
        srSummary:
          "Points of interest are pinned with keywords and projected to the nearest edge.",
      },
      {
        id: "map-3",
        label: "Ship",
        at: 1,
        caption: "Export as JSON. The router picks it up without a deploy.",
        srSummary:
          "Maps export as JSON that the A-star router consumes without a redeploy.",
      },
    ],
  },
];

export const CHAPTER_METRICS: ChapterMetric[] = [
  { label: "Feed latency", value: "1.8s", delta: "p95 end-to-end" },
  { label: "Gate reroute", value: "< 4s", delta: "detect → notify" },
  { label: "Coverage", value: "100%", delta: "of terminal graph" },
];

export const PROOF_CARDS: ProofCard[] = [
  {
    id: "flight-data",
    label: "Real-time flight data",
    value: "4s",
    description:
      "Continuous ingest from airline and airport feeds. No polling loops, no stale gate data.",
  },
  {
    id: "airport-access",
    label: "Airport-specific access",
    value: "Per-airport",
    description:
      "Operator accounts are scoped to their airport. Passenger data never crosses tenants.",
  },
  {
    id: "voice",
    label: "No-app wayfinding",
    value: "Any phone",
    description:
      "Passengers dial in and hear turn-by-turn directions. Works on a flip phone as well as a flagship.",
  },
  {
    id: "editor",
    label: "Visual map editor",
    value: "Hours",
    description:
      "Map a terminal in a single shift. No CAD exports, no GIS team, no deploy to ship updates.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "integrations",
    question: "Select Integrations",
    answer:
      "Start by choosing which of your airport's existing systems you want Nodestra to integrate with, whether that is MappedIn for indoor mapping, WebTrack for flight data, or other infrastructure already in place. We work closely with your team to develop a Nodestra agent that understands your systems and turns them into a seamless, passenger-centric voice assistant.",
  },
  {
    id: "launch",
    question: "Give to Passengers",
    answer:
      "Passengers interact with Nodestra by calling a dedicated number or scanning a QR code. Our team helps you promote the service through digital and physical signage, trains your help desk staff to share the number, and explores additional rollout strategies tailored to your airport's operation. It is a simple, friction-free way for passengers to get real-time directions.",
  },
  {
    id: "optimize",
    question: "Analyze and Iterate",
    answer:
      "Once Nodestra is live, we provide a real-time dashboard that shows agent performance metrics, highlights confusing areas in your terminal flow, and surfaces passenger behavior patterns. You can fine-tune the agent directly from the console, making continuous improvements based on actual passenger interactions without requiring a redeploy.",
  },
];

export type NavItem = {
  id: string;
  label: string;
  /** Sections this tab should light up for (in addition to `id`). */
  covers?: string[];
};

/**
 * Tabs shown in the floating pill nav. `id` is the DOM id the tab scrolls to;
 * `covers` lists additional section ids that should keep this tab active
 * (so scrolling through `gate-recovery` still highlights "Live").
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "voice", label: "Voice" },
  { id: "live-intel", label: "Live", covers: ["live-intel", "gate-recovery"] },
  { id: "map-builder", label: "Map" },
  { id: "faq", label: "FAQ", covers: ["proof", "faq", "conversion"] },
];

export const CONVERSION_CONTENT = {
  title: "Ready for the future?",
  sub: "Book a 30-minute demo for a live walkthrough of a Nodestra agent integrated with your airport's indoor mapping and live flight tracking. No commitment required.",
  primaryCta: "Book Demo",
  secondaryCta: "Sign In",
};
