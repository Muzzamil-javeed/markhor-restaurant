"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import {
  isAdminPath,
  MOTION,
  readPreloaderSeen,
  writePreloaderSeen,
} from "@/lib/motion";
import { SmokeLayer } from "@/components/transition/SmokeLayer";

const WORD = "MARKHOR";

function hideBootShell() {
  document.getElementById("mk-boot-shell")?.setAttribute("data-hidden", "1");
  document.documentElement.classList.add("mk-ready");
}

export function Preloader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  const skip = useMemo(() => isAdminPath(pathname || "/"), [pathname]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (skip || readPreloaderSeen()) {
        hideBootShell();
        return;
      }
      setShow(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [skip]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  useEffect(() => {
    if (!show || skip) return;

    let cancelled = false;
    const started = performance.now();
    const maxMs = reduce ? 600 : MOTION.preloader.max;
    const minMs = reduce ? 500 : MOTION.preloader.min;
    const steps = { fonts: 0, logo: 0, hero: pathname === "/" ? 0 : 1 };

    const tick = () => {
      if (cancelled) return;
      const ready = (steps.fonts + steps.logo + steps.hero) / 3;
      const elapsed = performance.now() - started;
      const timeRatio = Math.min(1, elapsed / minMs);
      const blended = Math.min(0.98, ready * 0.7 + timeRatio * 0.35);
      setProgress(Math.round(blended * 100));
    };

    const finish = () => {
      if (cancelled) return;
      setProgress(100);
      writePreloaderSeen();
      hideBootShell();
      setExiting(true);
      window.setTimeout(() => {
        if (!cancelled) setShow(false);
      }, reduce ? 220 : MOTION.preloader.exit * 1000);
    };

    document.fonts?.ready
      ?.then(() => {
        steps.fonts = 1;
        tick();
      })
      .catch(() => {
        steps.fonts = 1;
        tick();
      });

    const logo = new window.Image();
    logo.onload = () => {
      steps.logo = 1;
      tick();
    };
    logo.onerror = () => {
      steps.logo = 1;
      tick();
    };
    logo.src = "/logo.png";

    if (pathname === "/") {
      const hero = new window.Image();
      hero.onload = () => {
        steps.hero = 1;
        tick();
      };
      hero.onerror = () => {
        steps.hero = 1;
        tick();
      };
      hero.src = "/images/hero.avif";
    }

    const interval = window.setInterval(tick, 80);
    const minTimer = window.setTimeout(() => {
      const waitReady = window.setInterval(() => {
        const ready = steps.fonts && steps.logo && steps.hero;
        if (ready || performance.now() - started >= maxMs) {
          window.clearInterval(waitReady);
          finish();
        }
      }, 50);
    }, minMs);

    const hard = window.setTimeout(finish, maxMs);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(minTimer);
      window.clearTimeout(hard);
    };
  }, [pathname, reduce, show, skip]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          id="mk-preloader"
          key="preloader"
          className="fixed inset-0 z-[120] h-[100dvh] w-full overflow-hidden bg-brand"
          role="status"
          aria-live="polite"
          aria-label="Loading Markhor"
          initial={
            reduce
              ? { opacity: 0 }
              : { clipPath: "inset(0 0 0 100%)" }
          }
          animate={
            exiting
              ? reduce
                ? { opacity: 0 }
                : { clipPath: "inset(0 100% 0 0)" }
              : reduce
                ? { opacity: 1 }
                : { clipPath: "inset(0 0 0 0)" }
          }
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{
            duration: exiting
              ? reduce
                ? 0.2
                : MOTION.preloader.exit
              : reduce
                ? 0.25
                : 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationStart={hideBootShell}
        >
          {!reduce ? <SmokeLayer intensity="soft" /> : null}

          <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: reduce ? 0.2 : 0.55,
                delay: reduce ? 0 : 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-8 flex size-20 items-center justify-center overflow-hidden rounded-full bg-white sm:size-24"
            >
              <Image
                src="/logo.png"
                alt=""
                width={72}
                height={72}
                priority
                className="size-14 object-contain sm:size-16"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const sib = e.currentTarget.nextElementSibling;
                  if (sib instanceof HTMLElement) sib.hidden = false;
                }}
              />
              <span
                hidden
                className="font-display text-3xl font-extrabold text-brand"
              >
                M
              </span>
            </motion.div>

            <p className="font-eyebrow flex gap-[0.12em] text-sm font-semibold tracking-[0.22em] text-on-brand uppercase sm:text-base">
              {WORD.split("").map((letter, i) => (
                <motion.span
                  key={`${letter}-${i}`}
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: 14, x: 8 }
                  }
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{
                    delay: reduce
                      ? 0
                      : 0.35 + i * MOTION.preloader.letterStagger,
                    duration: reduce ? 0.15 : 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </p>

            <motion.p
              className="mt-4 max-w-sm text-center text-[11px] leading-relaxed tracking-wide text-on-brand/65 sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: exiting ? 0 : 1 }}
              transition={{ delay: reduce ? 0.1 : 0.95, duration: 0.4 }}
            >
              {site.loaderTagline}
            </motion.p>
            <span className="sr-only">{site.meta}</span>

            <motion.div
              className="mt-10 w-48 sm:w-60"
              animate={{ opacity: exiting ? 0 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <div className="h-[2px] overflow-hidden rounded-full bg-on-brand/20">
                <motion.div
                  className="h-full origin-left rounded-full bg-on-brand"
                  style={{ scaleX: Math.max(0.02, progress / 100) }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                />
              </div>
              <p className="mt-2.5 text-center font-mono text-[10px] tabular-nums tracking-[0.2em] text-on-brand/50">
                {progress.toString().padStart(2, "0")}
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
