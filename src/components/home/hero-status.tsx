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
    <aside className="w-full max-w-xs -rotate-1 rounded-2xl border border-cream/25 bg-cream/95 p-4 text-ink shadow-sm">
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
  );
}
