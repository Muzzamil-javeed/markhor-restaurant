"use client";

import { useReducedMotion } from "framer-motion";

const WISPS = [
  { left: "12%", w: "24%", h: "78%", delay: "0s", dur: "12s", opacity: 0.32 },
  { left: "26%", w: "28%", h: "90%", delay: "1.4s", dur: "14s", opacity: 0.4 },
  { left: "40%", w: "30%", h: "96%", delay: "0.5s", dur: "13s", opacity: 0.5 },
  { left: "52%", w: "26%", h: "88%", delay: "2.2s", dur: "15s", opacity: 0.42 },
  { left: "64%", w: "24%", h: "76%", delay: "3.1s", dur: "12.5s", opacity: 0.34 },
  { left: "74%", w: "20%", h: "68%", delay: "4s", dur: "11s", opacity: 0.28 },
  { left: "34%", w: "18%", h: "62%", delay: "5s", dur: "10.5s", opacity: 0.26 },
  { left: "48%", w: "16%", h: "58%", delay: "2.8s", dur: "9.5s", opacity: 0.22 },
] as const;

/** Soft BBQ smoke rising through the hero — CSS only, auto-loop. */
export function HeroSmoke() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden mix-blend-screen"
      aria-hidden
    >
      <div
        className="hero-smoke-haze absolute inset-x-[6%] bottom-[4%] h-[48%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 85%, rgba(255,236,210,0.22) 0%, rgba(246,244,242,0.08) 42%, transparent 74%)",
          filter: "blur(34px)",
        }}
      />
      <div
        className="hero-smoke-haze absolute inset-x-[20%] bottom-[18%] h-[28%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(232,120,48,0.14) 0%, transparent 70%)",
          filter: "blur(40px)",
          animationDelay: "1.5s",
        }}
      />

      {WISPS.map((wisp, index) => (
        <div
          key={index}
          className="hero-smoke-wisp absolute bottom-[-10%] rounded-[50%]"
          style={{
            left: wisp.left,
            width: wisp.w,
            height: wisp.h,
            opacity: wisp.opacity,
            animationDelay: wisp.delay,
            animationDuration: wisp.dur,
            background:
              index % 2 === 0
                ? "radial-gradient(ellipse at 50% 75%, rgba(255,248,240,0.58) 0%, rgba(246,244,242,0.16) 40%, transparent 72%)"
                : "radial-gradient(ellipse at 45% 70%, rgba(255,230,200,0.42) 0%, rgba(246,244,242,0.12) 38%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      ))}
    </div>
  );
}
