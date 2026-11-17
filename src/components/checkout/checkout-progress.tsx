"use client";

import { Check, ClipboardList, MapPin, Utensils } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  { id: 1, label: "Order type", Icon: Utensils },
  { id: 2, label: "Details", Icon: MapPin },
  { id: 3, label: "Review", Icon: ClipboardList },
] as const;

export function CheckoutProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol
      className="mb-6 flex items-center gap-1.5 sm:gap-2"
      aria-label="Checkout progress"
    >
      {STEPS.map((entry, index) => {
        const active = entry.id === step;
        const done = entry.id < step;
        const Icon = entry.Icon;
        return (
          <li key={entry.id} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors duration-300 sm:px-3 sm:py-2",
                active && "border-brand bg-tint",
                done && "border-brand/25 bg-white",
                !active && !done && "border-line bg-white",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:size-7",
                  active && "bg-brand text-on-brand",
                  done && "bg-brand/15 text-brand",
                  !active && !done && "bg-[#faf7f5] text-muted",
                )}
              >
                {done ? (
                  <Check className="size-3 sm:size-3.5" aria-hidden />
                ) : (
                  <Icon className="size-3 sm:size-3.5" aria-hidden />
                )}
              </span>
              <span className="min-w-0 truncate">
                <span
                  className={cn(
                    "hidden text-[9px] font-semibold tracking-[0.12em] uppercase sm:block",
                    active ? "text-brand" : "text-muted",
                  )}
                >
                  Step {entry.id}
                </span>
                <span
                  className={cn(
                    "block truncate text-xs font-semibold sm:text-[13px]",
                    active || done ? "text-ink" : "text-muted",
                  )}
                >
                  {entry.label}
                </span>
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <span
                className={cn(
                  "hidden h-px w-3 shrink-0 sm:block sm:w-4",
                  done ? "bg-brand/40" : "bg-line",
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
