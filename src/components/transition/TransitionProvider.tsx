"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import {
  INITIAL_PHASE,
  labelForHref,
  MOTION,
  transitionReducer,
  type PhaseState,
} from "@/lib/motion";

type TransitionContextValue = {
  state: PhaseState;
  navigate: (href: string, label?: string) => void;
  reducedMotion: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

const SAFETY_MS = 2500;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(transitionReducer, INITIAL_PHASE);
  const pendingPath = useRef<string | null>(null);
  const safetyTimer = useRef<number | null>(null);
  const coverTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);
  const reducedMotion = Boolean(useReducedMotion());

  const clearTimers = () => {
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    if (coverTimer.current) window.clearTimeout(coverTimer.current);
    if (revealTimer.current) window.clearTimeout(revealTimer.current);
    safetyTimer.current = null;
    coverTimer.current = null;
    revealTimer.current = null;
  };

  const finishReveal = useCallback(() => {
    clearTimers();
    dispatch({ type: "REVEAL_DONE" });
    pendingPath.current = null;
  }, []);

  const startReveal = useCallback(() => {
    dispatch({ type: "ROUTE_READY" });
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
    const main = document.querySelector("main");
    if (main instanceof HTMLElement) {
      if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
      window.requestAnimationFrame(() => main.focus({ preventScroll: true }));
    }
    const ms = reducedMotion ? 200 : MOTION.curtain.reveal * 1000;
    revealTimer.current = window.setTimeout(finishReveal, ms + 40);
  }, [finishReveal, reducedMotion]);

  const navigate = useCallback(
    (href: string, label?: string) => {
      const destLabel = label ?? labelForHref(href);
      const pathOnly = href.split("?")[0]?.split("#")[0] || "/";

      if (pathOnly.startsWith("/admin")) {
        router.push(href);
        return;
      }

      // Queue latest while mid-transition
      clearTimers();
      pendingPath.current = pathOnly;
      dispatch({ type: "START_COVER", href, label: destLabel });

      const coverMs = reducedMotion ? 200 : MOTION.curtain.cover * 1000;
      coverTimer.current = window.setTimeout(() => {
        dispatch({ type: "COVER_DONE" });
        router.push(href);
      }, coverMs);

      safetyTimer.current = window.setTimeout(() => {
        startReveal();
      }, SAFETY_MS);
    },
    [reducedMotion, router, startReveal],
  );

  useEffect(() => {
    if (!pendingPath.current) return;
    if (pathname !== pendingPath.current) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => startReveal());
    });
  }, [pathname, searchParams, startReveal]);

  useEffect(() => {
    const onPop = () => {
      clearTimers();
      dispatch({ type: "FORCE_IDLE" });
      pendingPath.current = null;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => () => clearTimers(), []);

  const value = useMemo(
    () => ({ state, navigate, reducedMotion }),
    [state, navigate, reducedMotion],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionNav() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransitionNav must be used within TransitionProvider");
  }
  return ctx;
}

/** Optional: returns a no-op navigate when outside provider (SSR safety). */
export function useOptionalTransitionNav() {
  return useContext(TransitionContext);
}
