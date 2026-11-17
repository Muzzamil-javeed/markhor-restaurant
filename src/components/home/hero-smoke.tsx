"use client";

import { useReducedMotion } from "framer-motion";

const WISPS = [
  { left: "18%", w: "22%", h: "70%", delay: "0s", dur: "11s", opacity: 0.35 },
  { left: "32%", w: "26%", h: "85%", delay: "1.8s", dur: "13s", opacity: 0.42 },
  { left: "46%", w: "28%", h: "92%", delay: "0.6s", dur: "12s", opacity: 0.48 },
  { left: "58%", w: "24%", h: "80%", delay: "2.6s", dur: "14s", opacity: 0.38 },
  { left: "70%", w: "20%", h: "65%", delay: "3.4s", dur: "11.5s", opacity: 0.3 },
  { left: "38%", w: "18%", h: "60%", delay: "4.2s", dur: "10s", opacity: 0.28 },
] as const;

/** Soft BBQ smoke rising through the hero — CSS only, auto-loop. */
export function HeroSmoke() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {/* Heat haze near the grill / meat */}
      <div
        className="hero-smoke-haze absolute inset-x-[10%] bottom-[8%] h-[42%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(246,244,242,0.16) 0%, rgba(246,244,242,0.05) 45%, transparent 72%)",
          filter: "blur(28px)",
        }}
      />

      {WISPS.map((wisp, index) => (
        <div
          key={index}
          className="hero-smoke-wisp absolute bottom-[-8%] rounded-[50%]"
          style={{
            left: wisp.left,
            width: wisp.w,
            height: wisp.h,
            opacity: wisp.opacity,
            animationDelay: wisp.delay,
            animationDuration: wisp.dur,
            background:
              "radial-gradient(ellipse at 50% 75%, rgba(246,244,242,0.55) 0%, rgba(246,244,242,0.18) 38%, transparent 70%)",
            filter: "blur(26px)",
          }}
        />
      ))}
    </div>
  );
}
