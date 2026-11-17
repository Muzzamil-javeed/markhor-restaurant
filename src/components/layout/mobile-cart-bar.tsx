"use client";

import { formatPKR } from "@/lib/format";
import {
  selectItemCount,
  selectSubtotal,
  useCartStore,
} from "@/store/cart";
import { useCartHydration } from "@/store/use-cart-hydration";

export function MobileCartBar() {
  const hydrated = useCartHydration();
  const lines = useCartStore((state) => state.lines);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const count = hydrated ? selectItemCount(lines) : 0;
  const subtotal = hydrated ? selectSubtotal(lines) : 0;

  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <button
        type="button"
        onClick={openDrawer}
        className="pointer-events-auto flex h-12 w-full items-center justify-between rounded-2xl bg-brand px-4 text-sm font-medium text-on-brand shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        aria-label={`View cart, ${count} items, ${formatPKR(subtotal)}`}
      >
        <span>View cart</span>
        <span className="tabular-nums">
          {count} {count === 1 ? "item" : "items"} · {formatPKR(subtotal)}
        </span>
      </button>
    </div>
  );
}
