"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { MOTION } from "@/lib/motion";

/** Fade/slide first-screen content after curtain opens. */
export function PageEntrance({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: MOTION.pageIn.y }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.2 : MOTION.pageIn.duration,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function PageEntranceStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : MOTION.pageIn.stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const pageEntranceItem = {
  hidden: { opacity: 0, y: MOTION.pageIn.y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.pageIn.duration, ease: [0.22, 1, 0.36, 1] },
  },
};
