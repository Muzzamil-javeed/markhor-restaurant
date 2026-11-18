"use client";

import { useSyncExternalStore } from "react";
import { formatTime12, getOpenStatus } from "@/lib/hours";
import { site } from "@/data/site";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  window.addEventListener("focus", onStoreChange);
  return () => {
    window.clearInterval(id);
    window.removeEventListener("focus", onStoreChange);
  };
}

/** Tiny client island — keeps the hero image on the server path for LCP. */
export function HeroStatusCard() {
  const label = useSyncExternalStore(
    subscribe,
    () => getOpenStatus().label,
    () => null,
  );
  const closes = useSyncExternalStore(
    subscribe,
    () => getOpenStatus().schedule?.closes ?? null,
    () => null,
  );
  const ready = label !== null;
  const isOpen = label === "Open";
  const closing = closes ? formatTime12(closes) : null;

  return (
    <div className="hero-hanging-sign relative mx-auto w-full max-w-xs pt-3 lg:mx-0">
      <span
        className="absolute top-0 left-1/2 z-[2] size-3 -translate-x-1/2 rounded-full border border-[#3d2918] bg-[radial-gradient(circle_at_35%_30%,#d4a574_0%,#8b5a2b_45%,#4a2f18_100%)] shadow-[0_2px_4px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]"
        aria-hidden
      />

      <svg
        className="pointer-events-none absolute top-[6px] left-1/2 h-10 w-[72%] -translate-x-1/2 overflow-visible"
        viewBox="0 0 100 40"
        fill="none"
        aria-hidden
      >
        <path
          d="M50 2 C42 14 28 26 14 38"
          stroke="#6b4423"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="hero-rope-stroke"
        />
        <path
          d="M50 2 C42 14 28 26 14 38"
          stroke="#c4a574"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M50 2 C58 14 72 26 86 38"
          stroke="#6b4423"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="hero-rope-stroke"
        />
        <path
          d="M50 2 C58 14 72 26 86 38"
          stroke="#c4a574"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      <aside className="relative mt-9 rotate-[2.5deg] rounded-2xl border border-[#c9b8a6] bg-[#f7f1e8] p-4 text-ink shadow-[0_14px_36px_rgba(10,5,6,0.35),inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="flex items-center justify-between gap-2">
          <p className="font-eyebrow text-[10px] font-semibold text-brand uppercase">
            Today
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-300 ${
              ready && isOpen
                ? "bg-emerald-600 text-white"
                : "bg-ink/10 text-ink"
            }`}
          >
            {ready && isOpen ? (
              <span
                className="relative inline-flex size-1.5 items-center justify-center"
                aria-hidden
              >
                <span className="animate-status-pulse absolute inset-0 rounded-full bg-emerald-200" />
                <span className="relative size-1.5 rounded-full bg-emerald-200" />
              </span>
            ) : null}
            {!ready ? "…" : isOpen ? "Open" : "Closed"}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">
          {ready && isOpen && closing
            ? `Closes around ${closing}`
            : ready
              ? "Schedule ahead or call us"
              : "Checking hours…"}
        </p>
        <p className="mt-3 font-display text-lg leading-tight text-ink">
          {site.tagline}
        </p>
      </aside>
    </div>
  );
}
