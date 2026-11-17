"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import { SmokeLayer } from "@/components/transition/SmokeLayer";
import { useTransitionNav } from "@/components/transition/TransitionProvider";

export function PageCurtain() {
  const { state, reducedMotion } = useTransitionNav();
  const systemReduce = useReducedMotion();
  const reduce = reducedMotion || Boolean(systemReduce);
  const active = state.phase !== "idle";
  const covering =
    state.phase === "covering" || state.phase === "covered";
  const revealing = state.phase === "revealing";

  const ease = MOTION.curtain.ease;
  const label = state.label ?? "Markhor";

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[90] h-[100dvh] w-full overflow-hidden bg-brand"
          style={{ pointerEvents: covering ? "auto" : "none" }}
          aria-hidden
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
          animate={
            revealing
              ? reduce
                ? { opacity: 0 }
                : { clipPath: "inset(0 0 100% 0)" }
              : reduce
                ? { opacity: 1 }
                : { clipPath: "inset(0 0 0 0)" }
          }
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{
            duration: reduce ? 0.2 : MOTION.curtain.cover,
            ease,
          }}
        >
          {!reduce ? <SmokeLayer intensity="soft" /> : null}

          <div className="relative flex h-full flex-col items-center justify-center px-6">
            <motion.div
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: reduce ? 0.2 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 flex size-20 items-center justify-center overflow-hidden rounded-full bg-white sm:size-24"
            >
              <Image
                src="/logo.png"
                alt=""
                width={72}
                height={72}
                className="size-14 object-contain sm:size-16"
                priority
              />
            </motion.div>

            <motion.p
              className="font-display text-3xl font-extrabold tracking-[0.18em] text-on-brand uppercase sm:text-4xl"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.1, duration: 0.35 }}
            >
              Markhor
            </motion.p>
            <motion.p
              className="mt-3 font-eyebrow text-[11px] font-semibold tracking-[0.28em] text-on-brand/70 uppercase sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.18, duration: 0.3 }}
            >
              {label}
            </motion.p>

            <motion.div
              className="mt-10 h-[2px] w-36 overflow-hidden rounded-full bg-on-brand/20 sm:w-44"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.22 }}
            >
              <motion.div
                className="h-full origin-left rounded-full bg-on-brand/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: covering || revealing ? 1 : 0.35 }}
                transition={{
                  duration: reduce ? 0.25 : MOTION.curtain.cover,
                  ease,
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
