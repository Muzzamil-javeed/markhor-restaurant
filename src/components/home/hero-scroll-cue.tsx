"use client";

import { useReducedMotion } from "framer-motion";

export function HeroScrollCue() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute bottom-5 left-1/2 z-[4] hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      aria-hidden
    >
      <span className="font-eyebrow text-[9px] tracking-[0.22em] text-cream/45 uppercase">
        Scroll
      </span>
      <span
        className={`relative h-8 w-px overflow-hidden bg-cream/20 ${
          reduce ? "" : "hero-scroll-line"
        }`}
      >
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-[#e87830] to-transparent" />
      </span>
    </div>
  );
}
