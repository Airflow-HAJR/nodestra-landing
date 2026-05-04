import type { ReactNode } from "react";
import {
  BellRing,
  Clock3,
  MapPin,
  MessageSquare,
  Navigation,
  PhoneCall,
  Plane,
} from "lucide-react";
import { VoiceOrb } from "./VoiceOrb";

type Props = {
  id: string;
  isActive: boolean;
};

export function ChapterVisual({ id, isActive }: Props) {
  if (id === "voice") return <VoicePanel isActive={isActive} />;
  if (id === "live-intel") return <LiveBoard isActive={isActive} />;
  if (id === "gate-recovery") return <GateSwap isActive={isActive} />;
  return <TerminalTrace isActive={isActive} />;
}

function PanelChrome({
  title,
  meta,
  phase,
  className = "",
  children,
}: {
  title: string;
  meta: string;
  phase: "idle" | "listening" | "speaking";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`lp-chapter-panel-wrap ${className}`}>
      <div className="lp-panel-orb-badge">
        <VoiceOrb size="xs" phase={phase} />
        <span>Voice layer live</span>
      </div>

      <div className="lp-panel">
        <div className="lp-panel-head lp-panel-head-rich">
          <div className="lp-panel-head-main">
            <span className="lp-panel-head-title">{title}</span>
            <span className="lp-panel-head-meta">{meta}</span>
          </div>
          <div className="lp-panel-head-orb">
            <VoiceOrb size="sm" phase={phase} />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

function VoicePanel({ isActive }: { isActive: boolean }) {
  const phase = isActive ? "speaking" : "listening";

  return (
    <div className="lp-voice-panel">
      <div className="lp-voice-hero">
        <VoiceOrb size="md" phase={phase} className="lp-voice-orb" />
        <div className="lp-voice-status-stack">
          <span className="lp-voice-status-pill">
            <PhoneCall size={12} />
            Inbound call connected
          </span>
          <span className="lp-voice-status-pill">
            <MessageSquare size={12} />
            English detected
          </span>
          <span className="lp-voice-status-pill">
            <Navigation size={12} />
            Route generated in 1.2s
          </span>
        </div>
      </div>

      <div className="lp-voice-bubbles">
        <div className="lp-vb lp-vb-user">
          <MessageSquare size={11} />I just landed. How do I get to baggage
          claim?
        </div>
        <div className="lp-vb lp-vb-agent">
          <Navigation size={11} />
          Walk forward 120 metres, then take the escalator down one level.
        </div>
        <div className="lp-vb lp-vb-agent is-update">
          <BellRing size={11} />
          Carousel updated to 6. I&apos;ve adjusted the rest of your route.
        </div>
      </div>

      <div className="lp-voice-footer">
        <span className="lp-voice-footer-label">Current destination</span>
        <span className="lp-voice-footer-value">
          Baggage Claim 6 · 6 min walk
        </span>
      </div>
    </div>
  );
}

function LiveBoard({ isActive }: { isActive: boolean }) {
  const rows = [
    {
      flight: "UA 238",
      gate: "B12",
      status: "Boarding",
      tone: "ok",
      eta: "now",
    },
    {
      flight: "DL 094",
      gate: "C04",
      status: "Delayed",
      tone: "warn",
      eta: "+24m",
    },
    {
      flight: "AA 715",
      gate: "A21",
      status: "On time",
      tone: "ok",
      eta: "18m",
    },
    {
      flight: "BA 287",
      gate: "D09",
      status: "Reassign",
      tone: "alert",
      eta: "now",
    },
  ];
  const density = [
    { zone: "Security", value: "72%", className: "is-hot" },
    { zone: "Concourse C", value: "41%", className: "is-mid" },
    { zone: "Baggage", value: "28%", className: "is-calm" },
  ];

  return (
    <PanelChrome
      title="Ops stream"
      meta="Feeds fused for voice routing"
      phase={isActive ? "listening" : "idle"}
    >
      <div className="lp-panel-command-row">
        <span className="lp-panel-command-label">Assistant context</span>
        <span className="lp-panel-command-text">
          "What is happening in Terminal C right now?"
        </span>
      </div>

      <ul className="lp-panel-rows">
        {rows.map((r, i) => (
          <li
            key={r.flight}
            className="lp-panel-row"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className="lp-panel-row-lead">
              <Plane size={13} /> {r.flight}
            </span>
            <span className="lp-panel-row-gate">{r.gate}</span>
            <span className={`lp-panel-row-status is-${r.tone}`}>
              {r.status}
            </span>
            <span className="lp-panel-row-eta">
              <Clock3 size={11} /> {r.eta}
            </span>
          </li>
        ))}
      </ul>

      <div className="lp-density-stack">
        {density.map((item) => (
          <div key={item.zone} className="lp-density-row">
            <span className="lp-density-zone">{item.zone}</span>
            <span className="lp-density-track">
              <span
                className={`lp-density-fill ${item.className}`}
                style={{ width: item.value }}
              />
            </span>
            <span className="lp-density-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="lp-panel-foot">
        <BellRing size={12} /> Voice answers stay synchronized with live airport
        state
      </div>
    </PanelChrome>
  );
}

function GateSwap({ isActive }: { isActive: boolean }) {
  return (
    <PanelChrome
      title="Recovery loop"
      meta="Detect, reroute, notify"
      phase={isActive ? "speaking" : "idle"}
    >
      <div className="lp-swap-row">
        <div className="lp-swap-cell lp-swap-from">
          <span className="lp-swap-cell-label">Was</span>
          <span className="lp-swap-cell-value">C04</span>
        </div>
        <span className="lp-swap-arrow" aria-hidden="true">
          →
        </span>
        <div className="lp-swap-cell lp-swap-to">
          <span className="lp-swap-cell-label">Now</span>
          <span className="lp-swap-cell-value">E17</span>
        </div>
      </div>

      <div className="lp-swap-meta">
        <div className="lp-swap-stat">
          <span className="lp-swap-stat-value">212</span>
          <span className="lp-swap-stat-label">passengers notified</span>
        </div>
        <div className="lp-swap-stat">
          <span className="lp-swap-stat-value">3.4s</span>
          <span className="lp-swap-stat-label">detect → dispatch</span>
        </div>
      </div>

      <div className="lp-reroute-flow">
        <div className="lp-reroute-node">
          <span className="lp-reroute-node-kicker">Voice update</span>
          <span className="lp-reroute-node-copy">
            “Your gate changed to E17. Follow the new route.”
          </span>
        </div>
        <div className="lp-reroute-node is-ghost">
          <span className="lp-reroute-node-kicker">Notification stack</span>
          <span className="lp-reroute-node-copy">
            SMS fallback, web handoff, and live call narration stay aligned.
          </span>
        </div>
      </div>
    </PanelChrome>
  );
}

function TerminalTrace({ isActive }: { isActive: boolean }) {
  return (
    <PanelChrome
      title="Map editor"
      meta="Floor plan → graph → route"
      phase={isActive ? "listening" : "idle"}
      className="is-map"
    >
      <div className="lp-panel-command-row">
        <span className="lp-panel-command-label">Operator action</span>
        <span className="lp-panel-command-text">
          Import plan, trace corridors, publish before the morning rush.
        </span>
      </div>

      <svg viewBox="0 0 360 220" className="lp-map-svg" aria-hidden="true">
        <defs>
          <linearGradient id="trace" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.15)" />
            <stop offset="45%" stopColor="rgba(99,102,241,0.95)" />
            <stop offset="100%" stopColor="rgba(42,74,94,0.25)" />
          </linearGradient>
        </defs>
        <path
          d="M20 110 L140 110 L140 40 L260 40 L260 110 L340 110"
          fill="none"
          stroke="rgba(10,21,32,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M140 110 L140 180 L260 180 L260 110"
          fill="none"
          stroke="rgba(10,21,32,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M20 110 L140 110 L140 40 L260 40 L260 110 L340 110"
          fill="none"
          stroke="url(#trace)"
          strokeWidth="3"
          strokeLinecap="round"
          className="lp-map-route"
        />
        <g className="lp-map-marks">
          <g transform="translate(20 110)">
            <circle r="4" fill="#6366F1" />
            <text x="0" y="-10" textAnchor="middle">
              Start
            </text>
          </g>
          <g transform="translate(140 40)">
            <circle r="4" fill="#6366F1" />
            <text x="0" y="-10" textAnchor="middle">
              Sec
            </text>
          </g>
          <g transform="translate(260 40)">
            <circle r="4" fill="#6366F1" />
            <text x="0" y="-10" textAnchor="middle">
              C12
            </text>
          </g>
          <g transform="translate(340 110)">
            <circle r="5" fill="#6366F1" stroke="#fff" strokeWidth="2" />
            <text x="0" y="-10" textAnchor="middle">
              Gate
            </text>
          </g>
        </g>
      </svg>

      <div className="lp-map-inspector">
        <div className="lp-map-inspector-card">
          <span className="lp-map-inspector-label">Waypoints</span>
          <span className="lp-map-inspector-value">43</span>
        </div>
        <div className="lp-map-inspector-card">
          <span className="lp-map-inspector-label">Edges</span>
          <span className="lp-map-inspector-value">58</span>
        </div>
        <div className="lp-map-inspector-card">
          <span className="lp-map-inspector-label">POIs tagged</span>
          <span className="lp-map-inspector-value">126</span>
        </div>
      </div>

      <div className="lp-panel-foot">
        <MapPin size={12} /> A* route · 412m · accessible · publish without
        deploy
      </div>
    </PanelChrome>
  );
}
