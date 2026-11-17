"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type QtyStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
  label: string;
  tone?: "light" | "dark";
};

export function QtyStepper({
  value,
  onDecrease,
  onIncrease,
  className,
  label,
  tone = "light",
}: QtyStepperProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center rounded-full border",
        dark
          ? "border-cream/20 bg-cream/5"
          : "rounded-xl border-line bg-white",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        className={cn(
          "inline-flex size-10 items-center justify-center focus-visible:outline-none focus-visible:ring-2",
          dark
            ? "rounded-full text-cream/80 hover:bg-cream/10 focus-visible:ring-cream/40"
            : "rounded-l-xl text-ink hover:bg-tint focus-visible:ring-brand/40",
        )}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span
        className={cn(
          "min-w-8 text-center text-sm font-semibold tabular-nums",
          dark ? "text-cream" : "text-ink",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={cn(
          "inline-flex size-10 items-center justify-center focus-visible:outline-none focus-visible:ring-2",
          dark
            ? "rounded-full text-cream/80 hover:bg-cream/10 focus-visible:ring-cream/40"
            : "rounded-r-xl text-ink hover:bg-tint focus-visible:ring-brand/40",
        )}
        aria-label={`Increase ${label}`}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
