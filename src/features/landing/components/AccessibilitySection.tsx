import { Globe } from "@/components/ui/globe";

const VIDEO_SRC = "/assets/text-chat.mp4";

const GLOBE_MARKERS = [
  { id: "tokyo",   location: [35.68,  139.69] as [number, number], label: "こんにちは" },
  { id: "madrid",  location: [40.42,   -3.70] as [number, number], label: "Hola" },
  { id: "paris",   location: [48.86,    2.35] as [number, number], label: "Bonjour" },
  { id: "berlin",  location: [52.52,   13.41] as [number, number], label: "Hallo" },
  { id: "beijing", location: [39.91,  116.39] as [number, number], label: "你好" },
  { id: "cairo",   location: [30.05,   31.25] as [number, number], label: "مرحبا" },
  { id: "lisbon",  location: [38.72,   -9.14] as [number, number], label: "Olá" },
  { id: "seoul",   location: [37.57,  126.98] as [number, number], label: "안녕하세요" },
];

const cardStyle: React.CSSProperties = {
  background: "var(--lp-surface)",
  borderRadius: 20,
  border: "1px solid rgba(15,20,35,0.08)",
  padding: "24px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const headingStyle: React.CSSProperties = {
  fontFamily: '"PP Neue York", serif',
  fontSize: "clamp(16px, 1.4vw, 20px)",
  fontWeight: 500,
  color: "var(--lp-ink)",
  margin: "0 0 6px",
};

const descStyle: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontSize: 13,
  color: "var(--lp-muted)",
  margin: 0,
  lineHeight: 1.6,
};

export function AccessibilitySection() {
  return (
    <section
      id="accessibility"
      className="lp-snap-section"
      aria-labelledby="lp-access-title"
      style={{ background: "var(--lp-bg)", padding: "60px 0" }}
    >
      <div style={{ width: "min(1180px, 100%)", margin: "0 auto", padding: "0 32px" }}>
        <div
          className="lp-reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >

          {/* Left: Globe */}
          <div style={cardStyle}>
            <div>
              <h3 id="lp-access-title" style={headingStyle}>Multilingual Support</h3>
              <p style={descStyle}>
                Serves 32+ languages. Supports every international flier across airports around the globe.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 160 }}>
                <Globe
                  markers={GLOBE_MARKERS}
                  markerColor={[0.29, 0.32, 0.47]}
                  baseColor={[0.88, 0.89, 0.94]}
                  glowColor={[0.29, 0.32, 0.47]}
                  dark={0}
                  mapBrightness={7}
                  markerSize={0.05}
                />
              </div>
            </div>
          </div>

          {/* Right: SMS video */}
          <div style={cardStyle}>
            <div>
              <h3 style={headingStyle}>Text Messages</h3>
              <p style={descStyle}>
                Hard-of-hearing passengers can text the Nodestra agent.
              </p>
            </div>
            <div style={{ minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <video
                src={VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  height: 160,
                  width: "auto",
                  maxWidth: "100%",
                  borderRadius: 12,
                  objectFit: "contain",
                  boxShadow: "0 12px 36px rgba(15,20,35,0.12)",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
