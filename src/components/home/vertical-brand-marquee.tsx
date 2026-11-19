const MARQUEE_PHRASES = [
  "MARKHOR RESTAURANT",
  "Western smokehouse",
  "Smoked low & slow",
  "Markhor",
  "DHA Phase 6",
] as const;

/** Enough repeats so the track always feels continuous on tall sections */
const MARQUEE_LINES = Array.from(
  { length: 16 },
  (_, index) => MARQUEE_PHRASES[index % MARQUEE_PHRASES.length]!,
);

/**
 * Left-edge outlined brand rail. Parent must be `relative`.
 * Sits above section backgrounds, below the maroon ribbon (higher z).
 */
export function VerticalBrandMarquee() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-[min(32vw,15rem)] overflow-hidden lg:block lg:w-[15rem]"
      aria-hidden
    >
      <div className="animate-marquee-vertical absolute top-0 left-[4px] flex flex-col items-start will-change-transform">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex flex-col items-start gap-16 py-4 sm:gap-20"
          >
            {MARQUEE_LINES.map((line, index) => (
              <p
                key={`${copy}-${index}`}
                className="font-display text-[clamp(4.5rem,12vw,9rem)] leading-none font-black tracking-[-0.02em] text-transparent uppercase [writing-mode:vertical-rl] select-none"
                style={{
                  WebkitTextStroke: "2px rgba(36, 26, 27, 0.18)",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
