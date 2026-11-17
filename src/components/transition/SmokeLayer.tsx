"use client";

import { cn } from "@/lib/cn";

type SmokeLayerProps = {
  className?: string;
  intensity?: "full" | "soft";
};

const PLUMES = [
  { left: "8%", w: "26%", h: "75%", delay: "0s", dur: "10s", slow: false },
  { left: "28%", w: "30%", h: "88%", delay: "1.4s", dur: "12s", slow: true },
  { left: "48%", w: "28%", h: "80%", delay: "0.6s", dur: "11s", slow: false },
  { left: "68%", w: "30%", h: "90%", delay: "2s", dur: "13s", slow: true },
  { left: "18%", w: "22%", h: "68%", delay: "2.8s", dur: "11.5s", slow: false },
] as const;

/** Soft rising smoke on a solid base — no grain/noise texture. */
export function SmokeLayer({ className, intensity = "full" }: SmokeLayerProps) {
  const soft = intensity === "soft";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {PLUMES.map((plume, index) => (
        <div
          key={index}
          className={cn(
            "absolute bottom-[-15%] rounded-[50%]",
            plume.slow ? "animate-smoke-plume-slow" : "animate-smoke-plume",
          )}
          style={{
            left: plume.left,
            width: plume.w,
            height: plume.h,
            animationDelay: plume.delay,
            animationDuration: plume.dur,
            opacity: soft ? 0.45 : 0.65,
            background: soft
              ? "radial-gradient(ellipse at 50% 70%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 45%, transparent 72%)"
              : "radial-gradient(ellipse at 50% 70%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 45%, transparent 72%)",
            filter: "blur(22px)",
          }}
        />
      ))}
    </div>
  );
}
