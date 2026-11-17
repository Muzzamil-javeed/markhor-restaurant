"use client";

import { cn } from "@/lib/cn";
import type { PublicOrder } from "@/lib/order-public";
import {
  orderStatusLabels,
  timelineStatuses,
  type OrderStatus,
} from "@/lib/order-status";

export function OrderStatusTimeline({ order }: { order: PublicOrder }) {
  if (order.status === "cancelled") {
    return (
      <div
        className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4"
        role="status"
      >
        <p className="font-heading text-sm font-semibold text-destructive">
          Order cancelled
        </p>
        <p className="mt-1 text-sm text-muted">
          If this looks wrong, call the restaurant and quote {order.code}.
        </p>
      </div>
    );
  }

  const steps = timelineStatuses(order.orderType);
  const currentIndex = steps.indexOf(order.status);

  return (
    <ol className="flex flex-col gap-0" aria-label="Order status">
      {steps.map((step, index) => {
        const state = stepState(step, index, currentIndex);
        return (
          <li key={step} className="flex gap-3">
            <div className="flex w-6 flex-col items-center">
              <span
                className={cn(
                  "mt-1 size-3 rounded-full border-2",
                  state === "done" && "border-brand bg-brand",
                  state === "current" &&
                    "border-brand bg-tint ring-4 ring-brand/15",
                  state === "upcoming" && "border-line bg-white",
                )}
                aria-hidden
              />
              {index < steps.length - 1 ? (
                <span
                  className={cn(
                    "min-h-8 w-0.5 flex-1",
                    index < currentIndex ? "bg-brand/50" : "bg-line",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
            <div className="pb-5">
              <p
                className={cn(
                  "text-sm font-semibold",
                  state === "upcoming" ? "text-muted" : "text-ink",
                )}
              >
                {orderStatusLabels[step]}
                {state === "current" ? (
                  <span className="ml-2 text-xs font-medium text-brand">
                    Current
                  </span>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function stepState(
  _step: OrderStatus,
  index: number,
  currentIndex: number,
): "done" | "current" | "upcoming" {
  if (currentIndex < 0) return "upcoming";
  if (index < currentIndex) return "done";
  if (index === currentIndex) return "current";
  return "upcoming";
}
