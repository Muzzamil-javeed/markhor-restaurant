"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useCallback, useEffect, useId, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react";
import { CartCheckoutButton } from "@/components/cart/cart-checkout-button";
import { CartEmpty } from "@/components/cart/cart-empty";
import { CartLineCard } from "@/components/cart/cart-line-card";
import { CartOrderType } from "@/components/cart/cart-order-type";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartUpsell } from "@/components/cart/cart-upsell";
import { CartVoucher } from "@/components/cart/cart-voucher";
import { selectItemCount, useCartStore } from "@/store/cart";
import { useCartHydration } from "@/store/use-cart-hydration";

export function CartDrawer() {
  const open = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const lines = useCartStore((state) => state.lines);
  const hydrated = useCartHydration();
  const count = hydrated ? selectItemCount(lines) : 0;
  const titleId = useId();
  const sliderRef = useRef<HTMLUListElement>(null);

  const scrollSlider = useCallback((direction: -1 | 1) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card
      ? card.getBoundingClientRect().width + 12
      : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeDrawer]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="animate-overlay-in absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
        aria-label="Close cart"
        onClick={closeDrawer}
      />
      <aside
        className="animate-drawer-in relative flex h-full w-full max-w-md flex-col overflow-hidden bg-background text-ink shadow-[-20px_0_50px_rgba(36,26,27,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="relative h-36 shrink-0 overflow-hidden">
          <Image
            src="/images/home/cart-banner.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="400px"
            priority
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,26,27,0.35)_0%,rgba(36,26,27,0.78)_100%)]"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-4">
            <div>
              <p className="font-eyebrow text-[10px] tracking-[0.22em] text-cream/70 uppercase">
                Markhor
              </p>
              <h2
                id={titleId}
                className="font-display mt-1 text-2xl font-black tracking-tight text-cream uppercase"
              >
                Your cart
              </h2>
              {count > 0 ? (
                <p className="mt-1 text-xs text-cream/75">
                  {count} {count === 1 ? "item" : "items"}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="ui-press inline-flex size-10 items-center justify-center rounded-full border border-cream/30 bg-cream/15 text-cream backdrop-blur-sm transition-colors hover:bg-cream/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50"
              aria-label="Close cart"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {!hydrated ? (
            <p className="px-5 py-8 text-sm text-muted" aria-busy>
              Loading cart…
            </p>
          ) : count === 0 ? (
            <div className="flex flex-1 flex-col px-5 py-6">
              <CartEmpty onBrowse={closeDrawer} />
            </div>
          ) : (
            <>
              <div className="px-5 pt-4">
                <CartOrderType />
              </div>

              <div className="relative mt-4 min-h-0">
                <div className="mb-2 flex items-center justify-between px-5">
                  <p className="font-eyebrow text-[10px] tracking-[0.18em] text-muted uppercase">
                    Items
                  </p>
                  {lines.length > 1 ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollSlider(-1)}
                        className="inline-flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                        aria-label="Previous cart item"
                      >
                        <ChevronLeft className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollSlider(1)}
                        className="inline-flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                        aria-label="Next cart item"
                      >
                        <ChevronRight className="size-4" aria-hidden />
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted">Swipe</p>
                  )}
                </div>
                <ul
                  ref={sliderRef}
                  className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {lines.map((line) => (
                    <li
                      key={line.key}
                      className="w-[min(78%,18rem)] shrink-0 snap-center"
                    >
                      <CartLineCard line={line} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto max-h-[52%] space-y-4 overflow-x-hidden overflow-y-auto border-t border-line bg-white px-5 pt-4 pb-5 [-ms-overflow-style:none] [scrollbar-width:thin]">
                <CartUpsell />
                <CartVoucher />
                <CartSummary />
                <CartCheckoutButton onNavigate={closeDrawer} />
                <TransitionLink
                  href="/cart"
                  onClick={closeDrawer}
                  className="inline-flex w-full items-center justify-center gap-2 text-center text-xs font-medium text-muted underline-offset-2 transition-colors hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <ShoppingBag className="size-3.5" aria-hidden />
                  Open full cart page
                </TransitionLink>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
