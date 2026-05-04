type OrbSize = 'xs' | 'sm' | 'md' | 'hero'
type OrbPhase = 'idle' | 'listening' | 'speaking'

interface VoiceOrbProps {
  size?: OrbSize
  phase?: OrbPhase
  className?: string
  /** Degrees of rotation applied to sphere + rings only (not the waveform). */
  rotation?: number
}

const BAR_COUNTS: Record<OrbSize, number> = {
  xs: 0,
  sm: 0,
  md: 14,
  hero: 0,
}

/**
 * Voice assistant orb — the visual identity for Nodestra's voice-first product.
 * Sizes: xs (badge), sm (panel indicator), md (chapter visual), hero (full-bleed).
 * Phase drives animation intensity: idle → listening → speaking.
 */
export function VoiceOrb({ size = 'md', phase = 'idle', className = '', rotation = 0 }: VoiceOrbProps) {
  const bars = BAR_COUNTS[size]
  const rotatorStyle =
    rotation !== 0 ? { transform: `rotate(${rotation}deg)` } : undefined

  return (
    <div
      className={`lp-orb lp-orb-${size} lp-orb-phase-${phase} ${className}`}
      aria-hidden="true"
    >
      <span className="lp-orb-rotator" style={rotatorStyle}>
        {/* sonar rings */}
        {size !== 'xs' && (
          <>
            <span className="lp-orb-ring lp-orb-r1" />
            <span className="lp-orb-ring lp-orb-r2" />
            {size !== 'sm' && <span className="lp-orb-ring lp-orb-r3" />}
          </>
        )}

        {/* sphere */}
        <span className="lp-orb-sphere">
          <span className="lp-orb-shine" />
          <span className="lp-orb-inner-glow" />
        </span>
      </span>

      {/* audio frequency bars (never rotated) */}
      {bars > 0 && (
        <span className="lp-orb-waves" aria-hidden="true">
          {Array.from({ length: bars }).map((_, i) => (
            <span
              key={i}
              className="lp-orb-bar"
              style={{
                animationDelay: `${(i % 5) * 160}ms`,
                animationDuration: `${720 + (i % 4) * 140}ms`,
              }}
            />
          ))}
        </span>
      )}
    </div>
  )
}
