"use client";

import { ShoppingBag } from "lucide-react";
import { selectItemCount, useCartStore } from "@/store/cart";
import { useCartHydration } from "@/store/use-cart-hydration";

export function HeaderCartButton() {
  const hydrated = useCartHydration();
  const lines = useCartStore((state) => state.lines);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const itemCount = hydrated ? selectItemCount(lines) : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="ui-press relative inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-xs font-semibold tracking-[0.14em] text-on-brand uppercase transition-colors duration-300 hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      aria-label={
        itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"
      }
    >
      <ShoppingBag className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">Cart</span>
      {hydrated && itemCount > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] leading-5 font-semibold text-cream">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}
