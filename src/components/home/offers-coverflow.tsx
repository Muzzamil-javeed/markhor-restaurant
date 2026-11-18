"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const SLIDES = [
  { src: "/images/home/menu-preview.jpg", alt: "Smokehouse grill plates" },
  { src: "/images/menu/beef-brisket.jpg", alt: "Markhor smoked brisket" },
  { src: "/images/home/how-it-works.jpg", alt: "Plated smoked meat" },
  { src: "/images/menu/the-beast.jpg", alt: "The Beast burger" },
  {
    src: "/images/menu/brisket-burger-highway-man-style.jpg",
    alt: "Highway Man brisket burger",
  },
  { src: "/images/hero.jpg", alt: "Markhor smokehouse grill" },
  { src: "/images/home/cart-banner.jpg", alt: "Markhor cart favourites" },
  { src: "/images/home/sides-dark.jpg", alt: "Smokehouse sides" },
  { src: "/images/menu/angus-ribeye-grass-fed-aus.jpg", alt: "Angus ribeye" },
  { src: "/images/menu/beef-mushroom-melt.jpg", alt: "Beef mushroom melt" },
  { src: "/images/menu/beef-ribs.jpg", alt: "Beef ribs" },
  {
    src: "/images/menu/beef-ribs-and-mac-burger.jpg",
    alt: "Beef ribs and mac burger",
  },
  { src: "/images/menu/beef-tenderloin-steak.jpg", alt: "Beef tenderloin" },
  { src: "/images/menu/brisket-500g.jpg", alt: "Brisket 500g" },
  {
    src: "/images/menu/brisket-and-cream-cheese-stuffed-texas-twinkies.jpg",
    alt: "Texas twinkies",
  },
  { src: "/images/menu/brisket-loaded-fries.jpg", alt: "Brisket loaded fries" },
  {
    src: "/images/menu/butterflied-jumbo-prawns.jpg",
    alt: "Butterflied jumbo prawns",
  },
  {
    src: "/images/menu/classic-texas-style-smoked-beef-burger.jpg",
    alt: "Texas smoked beef burger",
  },
  { src: "/images/menu/filet-mignon.jpg", alt: "Filet mignon" },
  { src: "/images/menu/fresh-green-salad.jpg", alt: "Fresh green salad" },
  {
    src: "/images/menu/kansas-city-brisket-nachos.jpg",
    alt: "Kansas City brisket nachos",
  },
  {
    src: "/images/menu/loaded-baked-potato-with-brisket-and-cheese.jpg",
    alt: "Loaded baked potato",
  },
  {
    src: "/images/menu/midwest-smoked-pulled-beef-burger.jpg",
    alt: "Midwest pulled beef burger",
  },
  { src: "/images/menu/pastrami-on-rye.jpg", alt: "Pastrami on rye" },
  {
    src: "/images/menu/philly-cheesesteak-burger.jpg",
    alt: "Philly cheesesteak burger",
  },
  { src: "/images/menu/smoked-brisket-tacos.jpg", alt: "Smoked brisket tacos" },
  { src: "/images/menu/stone-grilled-chicken.jpg", alt: "Stone grilled chicken" },
] as const;

const ease = [0.25, 0.8, 0.25, 1] as const;
const AUTO_MS = 5000;
/** How many cards peek on each side */
const SIDE = 2;

function relativeOffset(slideIndex: number, active: number, count: number) {
  let offset = slideIndex - active;
  const half = Math.floor(count / 2);
  if (offset > half) offset -= count;
  if (offset < -half) offset += count;
  return offset;
}

function coverStyle(offset: number, reduce: boolean | null) {
  const abs = Math.abs(offset);
  const side = Math.sign(offset);

  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
    };
  }

  // Far cards tuck behind the near stack (still animate — never pop out)
  const depth = Math.min(abs, SIDE + 1);
  const step = reduce ? 36 : 48;
  const x = side * (step + (depth - 1) * 28);
  const scale = 0.92 - (depth - 1) * 0.04;
  const rotate = reduce ? 0 : side * (5.5 + (depth - 1) * 2.5);
  const opacity = abs > SIDE ? 0 : 1;

  return { x, y: depth * 3, scale, rotate, opacity };
}

export function OffersCoverflow() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((current) => (current + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [go, paused, reduce]);

  const arrowClass =
    "ui-press inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:size-10";

  return (
    <div
      className="relative mx-auto mt-8 w-full max-w-[32rem] overflow-x-clip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -inset-x-4 -z-10 opacity-45 sm:-inset-x-8"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, transparent 0 32%, rgba(116,105,107,0.07) 33% 33.4%, transparent 34%), radial-gradient(circle at 50% 48%, transparent 0 48%, rgba(116,105,107,0.06) 49% 49.4%, transparent 50%)",
        }}
      />

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => go(-1)}
          className={arrowClass}
        >
          <ChevronLeft className="size-4 sm:size-[1.1rem]" aria-hidden />
        </button>

        <div
          className="relative h-[20rem] min-w-0 flex-1 overflow-hidden sm:h-[26rem]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Today’s board photos"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {SLIDES.map((slide, slideIndex) => {
              const offset = relativeOffset(slideIndex, index, count);
              const abs = Math.abs(offset);
              const active = offset === 0;
              // Keep near cards + one deeper layer mounted for smooth tuck-behind
              if (abs > SIDE + 1) return null;

              return (
                <motion.div
                  key={slide.src}
                  className="absolute h-[90%] w-[62%] overflow-hidden rounded-[1.5rem] border border-line/70 bg-transparent will-change-transform sm:w-[58%]"
                  style={{
                    zIndex: 40 - abs,
                    backfaceVisibility: "hidden",
                  }}
                  initial={false}
                  animate={coverStyle(offset, reduce)}
                  transition={{
                    type: reduce ? "tween" : "spring",
                    stiffness: 260,
                    damping: 28,
                    mass: 0.85,
                    duration: reduce ? 0.2 : undefined,
                    ease: reduce ? ease : undefined,
                    opacity: { duration: reduce ? 0.15 : 0.35, ease },
                  }}
                  aria-hidden={!active}
                >
                  <Image
                    src={slide.src}
                    alt={active ? slide.alt : ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 70vw, 360px"
                    priority={slideIndex < 3}
                    draggable={false}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Next photo"
          onClick={() => go(1)}
          className={arrowClass}
        >
          <ChevronRight className="size-4 sm:size-[1.1rem]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
