"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SLIDES = [
  {
    src: "/images/home/banner/the-beast.jpg",
    alt: "The Beast burger",
    position: "center 40%",
  },
  {
    src: "/images/home/banner/smoked-brisket-tacos.jpg",
    alt: "Smoked brisket tacos",
    position: "center 42%",
  },
  {
    src: "/images/home/banner/beef-brisket.jpg",
    alt: "Beef brisket",
    position: "center 40%",
  },
] as const;

const INTERVAL_MS = 6500;

/** Cinematic image crossfade — no video dependency. */
export function HeroMedia() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index] ?? SLIDES[0];

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#140D0E]" aria-hidden>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{
            duration: reduce ? 0.01 : 1.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.1 }}
            animate={reduce ? undefined : { scale: 1 }}
            transition={{
              duration: INTERVAL_MS / 1000 + 0.8,
              ease: "linear",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.position }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(36,26,27,0.12)_0%,rgba(10,5,6,0.55)_55%,rgba(10,5,6,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(10,5,6,0.55)_0%,transparent_28%,transparent_58%,rgba(10,5,6,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(125deg,rgba(94,15,29,0.22)_0%,transparent_42%,rgba(232,120,48,0.1)_100%)] mix-blend-soft-light" />
      <div className="hero-glow pointer-events-none absolute -left-1/4 top-1/4 z-[1] size-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(232,120,48,0.18)_0%,transparent_65%)] blur-2xl" />
    </div>
  );
}
