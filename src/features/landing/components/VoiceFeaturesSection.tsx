import { useEffect, useRef, useState } from "react";

const VOICE_FEATURES = [
  {
    label: "32+ Languages",
    color: "orange",
    audio: "/assets/audio/multilingual.mp3",
    description:
      "Supports every international traveller, anywhere on the globe.",
  },
  {
    label: "Instantaneous Updates",
    color: "blue",
    audio: "/assets/audio/instantaneous-updates.mp3",
    description:
      "Monitors your flight around the clock and reaches out the moment something changes, whether that's a gate reassignment, a delay, or a boarding call, before you've even thought to check.",
  },
  {
    label: "Indoor Navigation",
    color: "purple",
    audio: "/assets/audio/indoor-navigation.mp3",
    description:
      "Uses your airport's indoor mapping to guide every passenger, step by step, through even the most confusing terminals.",
  },
  {
    label: "Airport Info",
    color: "green",
    audio: "/assets/audio/airport-info.mp3",
    description:
      "Knows your airport inside out, from amenities and services to terminal layout and what's nearest your gate, so passengers always get a straight answer.",
  },
  {
    label: "Flight Tracking",
    color: "teal",
    audio: "/assets/audio/flight-tracking.mp3",
    description:
      "Tracks your flight in real time so nothing catches you off guard.",
  },
] as const;

export function VoiceFeaturesSection() {
  const [playingVoiceIndex, setPlayingVoiceIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingVoiceIndex(null);
  }

  function handleVoiceClick(index: number) {
    const feature = VOICE_FEATURES[index];
    if (!feature) return;

    if (index === playingVoiceIndex && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
        setPlayingVoiceIndex(index);
      } else {
        audioRef.current.pause();
        setPlayingVoiceIndex(null);
      }
      return;
    }

    stopAudio();

    const audio = new Audio(feature.audio);
    audioRef.current = audio;
    audio.play().catch(() => {});
    audio.addEventListener(
      "ended",
      () => {
        setPlayingVoiceIndex(null);
      },
      { once: true },
    );
    setPlayingVoiceIndex(index);
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="voice-features"
      className="lp-snap-section lp-voice-features-section py-24 px-6 md:px-12 bg-[var(--lp-bg)]"
      aria-labelledby="lp-voice-features-title"
    >
      <div className="mx-auto max-w-[1200px] w-full">
        <div className="text-center mb-16 lp-reveal">
          <h2
            id="lp-voice-features-title"
            style={{
              fontFamily: '"PP Neue York", serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 500,
              color: "var(--lp-ink)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Navigation, updates, and terminal info. <br className="hidden sm:block" />
            One call (or text) handles all of it.
          </h2>
          <p 
            className="mt-6 font-medium" 
            style={{ 
              color: "var(--lp-ink-soft)", 
              fontFamily: '"PP Neue York", serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              lineHeight: 1.2
            }}
          >
            Hear it for yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {VOICE_FEATURES.map((feature, index) => {
            const isPlaying = playingVoiceIndex === index;
            
            let spanClass = "";
            if (index === 0) spanClass = "col-span-1 sm:col-span-1 lg:col-span-2";
            else if (index === 1) spanClass = "col-span-1 sm:col-span-1 lg:col-span-2";
            else if (index === 2) spanClass = "col-span-1 sm:col-span-2 lg:col-span-2";
            else if (index === 3) spanClass = "col-span-1 sm:col-span-1 lg:col-span-3";
            else if (index === 4) spanClass = "col-span-1 sm:col-span-1 lg:col-span-3";

            // Use a single distinct cool color against the cream background
            const inactiveBgClass = "bg-[#D5D9EA]";
            const hoverClass = "hover:bg-[#C4CBE1]";

            const bgClass = isPlaying ? "bg-[var(--lp-ink)]" : `${inactiveBgClass} ${hoverClass}`;
            const btnBorderClass = isPlaying ? "border-white" : "border-[var(--lp-ink)]";
            const btnBgClass = isPlaying ? "bg-white text-[var(--lp-ink)]" : "bg-transparent text-[var(--lp-ink)] group-hover:bg-[var(--lp-ink)] group-hover:text-[var(--lp-surface)]";

            return (
              <button
                key={feature.label}
                type="button"
                className={`group flex flex-col justify-between p-8 sm:p-10 text-left transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--lp-ink)] focus:ring-offset-4 focus:ring-offset-[var(--lp-bg)] lp-reveal border-2 border-[var(--lp-ink)] rounded-[2.5rem] overflow-hidden ${bgClass} ${spanClass}`}
                onClick={() => handleVoiceClick(index)}
                aria-label={`${isPlaying ? "Pause" : "Play"} ${feature.label}`}
              >
                <div className="mb-12">
                  <h3
                    className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight"
                    style={{
                      fontFamily: '"PP Neue York", serif',
                      color: isPlaying ? "#FFFFFF" : "var(--lp-ink)",
                    }}
                  >
                    {feature.label}
                  </h3>
                  <p
                    className="text-lg sm:text-xl font-medium leading-relaxed"
                    style={{
                      fontFamily: '"PP Neue York", serif',
                      color: isPlaying ? "#FFFFFF" : "var(--lp-ink-soft)",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Play Button Block */}
                <div 
                  className={`mt-auto flex w-full items-center justify-between border-2 rounded-full p-5 transition-colors duration-300 ${btnBorderClass} ${btnBgClass}`}
                >
                  <span className="font-bold tracking-widest uppercase text-sm sm:text-base" style={{ fontFamily: '"PP Neue York", serif' }}>
                    {isPlaying ? "Pause AI Voice" : "Play AI Voice"}
                  </span>
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4L20 12L6 20V4Z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
