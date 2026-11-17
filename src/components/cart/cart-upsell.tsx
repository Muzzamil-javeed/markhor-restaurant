"use client";

import { useMemo } from "react";
import { MenuImage } from "@/components/menu/menu-image";
import { cn } from "@/lib/cn";
import { formatPKR } from "@/lib/format";
import { needsCustomisation } from "@/lib/menu";
import {
  buildLineKey,
  createDefaultSelection,
  unitPrice,
} from "@/lib/pricing";
import { suggestUpsells } from "@/lib/upsell";
import { useCartStore } from "@/store/cart";
import { useCustomiseStore } from "@/store/customise";
import { useToastStore } from "@/store/toast";

export function CartUpsell({ tone = "light" }: { tone?: "light" | "dark" }) {
  const lines = useCartStore((state) => state.lines);
  const add = useCartStore((state) => state.add);
  const openCustomise = useCustomiseStore((state) => state.open);
  const showToast = useToastStore((state) => state.show);
  const dark = tone === "dark";

  const suggestions = useMemo(
    () => suggestUpsells(lines.map((line) => line.itemId), 3),
    [lines],
  );

  if (suggestions.length === 0) return null;

  return (
    <section aria-labelledby="cart-upsell-title" className="flex flex-col gap-3">
      <h3
        id="cart-upsell-title"
        className={cn(
          "font-eyebrow text-[10px] font-semibold tracking-[0.18em] uppercase",
          dark
            ? "text-cream/45"
            : "font-heading text-sm tracking-normal text-ink normal-case",
        )}
      >
        Complete your meal
      </h3>
      <ul
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          /* Keep last card fully visible inside the drawer */
          "pe-1",
        )}
      >
        {suggestions.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex w-[10.75rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border",
              dark
                ? "border-cream/12 bg-[#140D0E]"
                : "w-[12rem] border-line bg-white p-3",
            )}
          >
            {dark ? (
              <MenuImage
                name={item.name}
                slug={item.slug}
                rounded="rounded-none"
                className="aspect-[4/3] shrink-0"
              />
            ) : null}
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col gap-2.5",
                dark && "p-3",
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "line-clamp-2 text-sm leading-snug font-medium",
                    dark ? "text-cream" : "text-ink",
                  )}
                  title={item.name}
                >
                  {item.name}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs tabular-nums",
                    dark ? "text-cream/50" : "text-muted",
                  )}
                >
                  {formatPKR(item.price)}
                </p>
              </div>
              <button
                type="button"
                className={cn(
                  "mt-auto inline-flex h-9 w-full shrink-0 items-center justify-center rounded-full px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2",
                  dark
                    ? "border border-cream/25 text-cream hover:bg-cream/10 focus-visible:ring-cream/40"
                    : "border border-line text-ink hover:bg-tint focus-visible:ring-brand/40",
                )}
                onClick={() => {
                  if (needsCustomisation(item)) {
                    openCustomise(item.id, item);
                    return;
                  }
                  const selection = createDefaultSelection(item);
                  add({
                    key: buildLineKey(item.id, selection),
                    itemId: item.id,
                    name: item.name,
                    unitPrice: unitPrice(item, selection),
                  });
                  showToast(`Added ${item.name}`);
                }}
              >
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
