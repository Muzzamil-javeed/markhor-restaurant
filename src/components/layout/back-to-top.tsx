"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export function BackToTop() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          key="back-to-top"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          className={cn(
            "fixed right-4 z-40 inline-flex size-11 items-center justify-center",
            "bottom-[5.5rem] md:bottom-6",
            "rounded-full border border-brand/20 bg-brand text-on-brand",
            "shadow-[0_10px_28px_rgba(94,15,29,0.28)]",
            "transition-transform duration-300 hover:scale-105 hover:bg-brand/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2",
          )}
          aria-label="Back to top"
        >
          <ChevronUp className="size-5" aria-hidden />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
