"use client";

import { useSyncExternalStore } from "react";
import { StatusPulse } from "@/components/ui/status-pulse";
import { cn } from "@/lib/cn";
import { getOpenStatus } from "@/lib/hours";

type OpenStatusPillProps = {
  className?: string;
  tone?: "light" | "dark";
};

/** Client-only open/closed label. Server snapshot is null to avoid UTC mismatch. */
function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  window.addEventListener("focus", onStoreChange);
  return () => {
    window.clearInterval(id);
    window.removeEventListener("focus", onStoreChange);
  };
}

function getClientLabel(): "Open" | "Closed" {
  return getOpenStatus().label;
}

function getServerLabel(): null {
  return null;
}

export function OpenStatusPill({
  className,
  tone = "light",
}: OpenStatusPillProps) {
  const label = useSyncExternalStore(subscribe, getClientLabel, getServerLabel);
  const ready = label !== null;
  const isOpen = label === "Open";
  const dark = tone === "dark";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-300 ease-out",
        !ready &&
          (dark ? "border-white/25 text-white/80" : "border-line text-muted"),
        ready &&
          isOpen &&
          (dark
            ? "border-emerald-300/35 bg-emerald-400/10 text-white"
            : "border-emerald-600/25 bg-emerald-50 text-emerald-900"),
        ready &&
          !isOpen &&
          (dark
            ? "border-white/20 bg-black/25 text-white/75"
            : "border-line bg-background text-muted"),
        className,
      )}
      aria-live="polite"
      suppressHydrationWarning
    >
      {ready && isOpen ? (
        <StatusPulse tone="emerald" live />
      ) : (
        <span
          className={cn(
            "size-1.5 rounded-full transition-colors duration-300",
            !ready && (dark ? "bg-white/50" : "bg-muted"),
            ready && !isOpen && (dark ? "bg-white/40" : "bg-muted"),
          )}
          aria-hidden
        />
      )}
      {label ?? "…"}
    </span>
  );
}
