"use client";

import { HomeSection } from "@/components/home/section";
import { cn } from "@/lib/cn";
import {
  ORDER_TYPES,
  orderTypeLabels,
  useOrderTypeStore,
  type OrderType,
} from "@/store/order-type";

export function HomeOrderTypeSelect() {
  const orderType = useOrderTypeStore((state) => state.orderType);
  const setOrderType = useOrderTypeStore((state) => state.setOrderType);

  return (
    <HomeSection
      id="order-type"
      eyebrow="How are you ordering?"
      title="Choose delivery, pickup, or dine-in"
      description="We remember your choice for checkout."
      className="bg-tint/40"
    >
      <div
        role="radiogroup"
        aria-label="Order type"
        className="grid gap-3 sm:grid-cols-3"
      >
        {ORDER_TYPES.map((type) => {
          const selected = orderType === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOrderType(type as OrderType)}
              className={cn(
                "rounded-2xl border px-4 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                selected
                  ? "border-brand bg-white text-brand shadow-sm"
                  : "border-line bg-white/70 text-ink hover:border-brand/40",
              )}
            >
              <span className="font-heading text-base font-semibold">
                {orderTypeLabels[type]}
              </span>
              <span className="mt-1 block text-sm text-muted">
                {type === "delivery" && "Brought to your door"}
                {type === "pickup" && "Collect from the restaurant"}
                {type === "dinein" && "Eat with us in DHA Phase 6"}
              </span>
            </button>
          );
        })}
      </div>
    </HomeSection>
  );
}
