"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
};

/**
 * GSAP stage — cinematic intro (per-letter), scroll parallax.
 */
export function HeroGsap({ children }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduce) {
      root.setAttribute("data-ready", "1");
      return;
    }

    const ctx = gsap.context(() => {
      const media = root.querySelector<HTMLElement>("[data-hero-media]");
      const wordmark = root.querySelector<HTMLElement>("[data-hero-wordmark]");
      const lines = root.querySelectorAll<HTMLElement>("[data-hero-line]");
      const chars = root.querySelectorAll<HTMLElement>("[data-hero-char]");
      const sub = root.querySelector<HTMLElement>("[data-hero-sub]");
      const chips = root.querySelectorAll<HTMLElement>("[data-hero-chip]");
      const ctas = root.querySelectorAll<HTMLElement>("[data-hero-cta]");
      const status = root.querySelector<HTMLElement>("[data-hero-status]");
      const cue = root.querySelector<HTMLElement>("[data-hero-cue]");

      if (wordmark) gsap.set(wordmark, { autoAlpha: 0, y: 12 });
      if (sub) gsap.set(sub, { autoAlpha: 0, y: 16 });
      if (status) gsap.set(status, { autoAlpha: 0, y: -18 });
      if (cue) gsap.set(cue, { autoAlpha: 0 });
      gsap.set(lines, { autoAlpha: 1 });
      gsap.set(chars, { y: "1.05em", autoAlpha: 0 });
      gsap.set(chips, { y: 16, autoAlpha: 0 });
      gsap.set(ctas, { y: 18, autoAlpha: 0, scale: 0.96 });
      if (media) gsap.set(media, { scale: 1.08 });
      root.setAttribute("data-ready", "1");

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (media) {
        intro.to(media, { scale: 1, duration: 2.2, ease: "power2.out" }, 0);
      }

      if (wordmark) {
        intro.fromTo(
          wordmark,
          { autoAlpha: 0, y: 12, letterSpacing: "0.42em" },
          { autoAlpha: 1, y: 0, letterSpacing: "0.28em", duration: 0.9 },
          0.15,
        );
      }

      // Stagger per line group so lines never visually stack into each other
      lines.forEach((line, lineIndex) => {
        const lineChars = line.querySelectorAll<HTMLElement>("[data-hero-char]");
        intro.to(
          lineChars,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.022,
            ease: "power4.out",
            onComplete: () => {
              gsap.set(lineChars, { clearProps: "transform" });
            },
          },
          0.4 + lineIndex * 0.16,
        );
      });

      if (sub) {
        intro.to(sub, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.25");
      }

      intro.to(
        chips,
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 },
        "-=0.25",
      );

      intro.to(
        ctas,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.35",
      );

      if (status) {
        intro.fromTo(
          status,
          { autoAlpha: 0, y: -18, rotate: 0 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 2.5,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.55",
        );
      }

      if (cue) {
        intro.to(cue, { autoAlpha: 1, duration: 0.5 }, "-=0.2");
      }

      if (media) {
        gsap.to(media, {
          yPercent: 12,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
          },
        });
      }

      gsap.to(root.querySelectorAll("[data-hero-fade]"), {
        y: -36,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [reduce]);

  return (
    <section
      ref={rootRef}
      className="hero-gsap-root relative isolate -mt-[var(--header-h,4.5rem)] flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#140D0E] text-cream"
    >
      {children}
    </section>
  );
}
