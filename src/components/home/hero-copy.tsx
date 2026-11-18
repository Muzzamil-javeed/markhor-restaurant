"use client";

import type { CSSProperties } from "react";

const LINES = [
  { text: "Smoked low.", hot: false },
  { text: "Slow.", hot: false },
  { text: "Served hot.", hot: true },
] as const;

function splitChars(text: string, hot: boolean) {
  return Array.from(text).map((char, index) => {
    const fireStyle = hot
      ? ({ ["--fire-delay"]: `${index * 0.14}s` } as CSSProperties)
      : undefined;

    return (
      <span
        key={`${text}-${index}`}
        data-hero-char
        className={
          hot
            ? "hero-fire-char inline-block"
            : "inline-block text-[#F3EADB]"
        }
        style={fireStyle}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });
}

/** Split-letter headline — “Served hot.” gets inner fire shimmer. */
export function HeroCopy() {
  return (
    <div
      className="mx-auto w-full max-w-[min(100%,56rem)] text-center"
      data-hero-fade
    >
      <p
        data-hero-wordmark
        className="font-display text-[10px] font-semibold tracking-[0.28em] text-cream/55 uppercase sm:text-[11px]"
      >
        Markhor
      </p>

      <p
        className="font-display mt-5 flex flex-col items-center gap-[0.12em] text-[clamp(2.85rem,calc(1.35rem+8.5vw),7.25rem)] font-black uppercase tracking-[-0.03em]"
        aria-label={LINES.map((line) => line.text).join(" ")}
      >
        {LINES.map((line) => (
          <span
            key={line.text}
            data-hero-line
            className={
              line.hot
                ? "hero-fire-line relative block w-full overflow-hidden leading-[0.95]"
                : "relative block w-full overflow-hidden leading-[0.95]"
            }
            aria-hidden
          >
            <span className="relative z-[1] inline-block whitespace-nowrap">
              {splitChars(line.text, line.hot)}
            </span>
          </span>
        ))}
      </p>

      <h1
        data-hero-sub
        className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-cream/80 sm:mt-6 sm:text-base"
      >
        Markhor Restaurant, western food in DHA Phase 6, Karachi
      </h1>
    </div>
  );
}
