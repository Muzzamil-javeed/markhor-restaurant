"use client";

import { cn } from "@/lib/cn";
import {
  ORDER_TYPES,
  orderTypeLabels,
  useCartStore,
  type OrderType,
} from "@/store/cart";

export function CartOrderType({ tone = "light" }: { tone?: "light" | "dark" }) {
  const orderType = useCartStore((state) => state.orderType);
  const setOrderType = useCartStore((state) => state.setOrderType);
  const dark = tone === "dark";

  return (
    <div
      role="radiogroup"
      aria-label="Order type"
      className="grid grid-cols-3 gap-2"
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
              "rounded-full border px-2 py-2.5 text-center text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 sm:text-sm",
              dark
                ? selected
                  ? "border-brand bg-brand text-on-brand focus-visible:ring-cream/40"
                  : "border-cream/20 bg-cream/5 text-cream/75 hover:border-cream/40 hover:bg-cream/10 focus-visible:ring-cream/40"
                : selected
                  ? "border-brand bg-tint text-brand focus-visible:ring-brand/40"
                  : "border-line bg-white text-ink hover:border-brand/40 focus-visible:ring-brand/40",
            )}
          >
            {orderTypeLabels[type]}
          </button>
        );
      })}
    </div>
  );
}
