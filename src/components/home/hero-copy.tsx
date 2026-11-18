"use client";

import { motion, useReducedMotion } from "framer-motion";

const LINES = ["Smoked low.", "Slow.", "Served hot."] as const;

export function HeroCopy() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="mx-auto w-full max-w-[min(100%,56rem)] text-center">
      <motion.p
        className="font-display text-[clamp(2.85rem,calc(1.35rem+8.5vw),7.25rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-[#F3EADB]"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : 0.18,
              delayChildren: reduce ? 0 : 0.15,
            },
          },
        }}
      >
        {LINES.map((line, index) => (
          <span key={line} className="block overflow-hidden py-[0.04em]">
            <motion.span
              className={
                index === 2
                  ? "hero-headline-hot block bg-gradient-to-b from-[#F3EADB] via-[#F3EADB] to-[#e87830] bg-clip-text text-transparent"
                  : "block"
              }
              variants={{
                hidden: reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: "110%", filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: reduce ? 0.2 : 0.85,
                    ease,
                  },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.p>

      <motion.h1
        className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-cream/80 sm:mt-6 sm:text-base"
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, y: 18, filter: "blur(6px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: reduce ? 0 : 0.75,
          duration: reduce ? 0.2 : 0.65,
          ease,
        }}
      >
        Markhor Restaurant, western food in DHA Phase 6, Karachi
      </motion.h1>
    </div>
  );
}
