"use client";

import { useReducedMotion } from "framer-motion";

const SPARKS = [
  { left: "8%", bottom: "22%", delay: "0s", dur: "7s", size: 2 },
  { left: "18%", bottom: "14%", delay: "1.2s", dur: "8.5s", size: 1.5 },
  { left: "72%", bottom: "18%", delay: "0.6s", dur: "6.8s", size: 2 },
  { left: "84%", bottom: "28%", delay: "2.1s", dur: "9s", size: 1.5 },
  { left: "42%", bottom: "10%", delay: "3s", dur: "7.4s", size: 1.5 },
  { left: "58%", bottom: "16%", delay: "1.8s", dur: "8.2s", size: 2 },
] as const;

/** Ember vignette, film grain, and soft ash sparks over the hero media. */
export function HeroAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      <div className="hero-ember-film absolute inset-0" />
      <div className="hero-film-grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />

      {!reduce
        ? SPARKS.map((spark, index) => (
            <span
              key={index}
              className="hero-spark absolute rounded-full bg-[#ffd2a0]"
              style={{
                left: spark.left,
                bottom: spark.bottom,
                width: spark.size,
                height: spark.size,
                animationDelay: spark.delay,
                animationDuration: spark.dur,
                boxShadow: "0 0 6px rgba(232,120,48,0.75)",
              }}
            />
          ))
        : null}
    </div>
  );
}
