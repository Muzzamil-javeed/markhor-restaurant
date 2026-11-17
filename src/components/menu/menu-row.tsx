"use client";

import { Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/data/menu-types";
import { cn } from "@/lib/cn";
import { formatPKR } from "@/lib/format";
import { needsCustomisation } from "@/lib/menu";
import {
  buildLineKey,
  createDefaultSelection,
  unitPrice,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { useCustomiseStore } from "@/store/customise";
import { useCartHydration } from "@/store/use-cart-hydration";
import { useToastStore } from "@/store/toast";

function priceLabel(item: MenuItem): string {
  if (item.variants && item.variants.length > 0) {
    const prices = item.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return formatPKR(min);
    return `${formatPKR(min)} / ${formatPKR(max)}`;
  }
  return formatPKR(item.price);
}

function variantHint(item: MenuItem): string | null {
  if (!item.variants?.length) return null;
  return item.variants.map((v) => v.label).join(" / ");
}

export function MenuRow({ item }: { item: MenuItem }) {
  const hydrated = useCartHydration();
  const lines = useCartStore((state) => state.lines);
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const openCustomise = useCustomiseStore((state) => state.open);
  const showToast = useToastStore((state) => state.show);

  const customise = needsCustomisation(item);
  const selection = createDefaultSelection(item);
  const simpleKey = buildLineKey(item.id, selection);
  const quantity = hydrated
    ? (lines.find((line) => line.key === simpleKey)?.quantity ?? 0)
    : 0;
  const soldOut = !item.available;
  const hint = variantHint(item);

  const addSimple = () => {
    addItem({
      key: simpleKey,
      itemId: item.id,
      name: item.name,
      unitPrice: unitPrice(item, selection),
      summary: hint || undefined,
    });
    showToast(`Added ${item.name}`);
  };

  const onRowActivate = () => {
    if (soldOut) return;
    if (customise) {
      openCustomise(item.id, item);
      return;
    }
    addSimple();
  };

  return (
    <div
      className={cn(
        "group relative flex gap-2 rounded-xl border border-transparent px-2 py-3 transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        !soldOut && "hover:border-line hover:bg-tint/40",
        soldOut && "opacity-70",
      )}
    >
      <span
        className={cn(
          "absolute top-3 bottom-3 left-0 w-0.5 rounded-full bg-brand opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          !soldOut && "group-hover:opacity-100",
        )}
        aria-hidden
      />

      <button
        type="button"
        disabled={soldOut}
        onClick={onRowActivate}
        className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        aria-label={
          soldOut
            ? `${item.name}, sold out`
            : customise
              ? `Customise ${item.name}`
              : `Add ${item.name}`
        }
      >
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "max-w-[65%] text-sm font-semibold text-ink sm:text-[15px]",
              soldOut && "line-through decoration-brand/60",
            )}
          >
            {item.name}
          </span>
          <span
            className="mb-[0.35em] min-w-4 flex-1 border-b-2 border-dotted border-line-strong"
            aria-hidden
          />
          <span
            className={cn(
              "shrink-0 text-sm font-semibold tabular-nums text-ink",
              soldOut && "line-through decoration-brand/60",
            )}
          >
            {priceLabel(item)}
          </span>
        </div>

        {(item.description || hint) && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
            {hint ? <span className="font-medium text-ink/70">{hint}. </span> : null}
            {item.description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {soldOut ? (
            <span className="font-eyebrow text-[10px] font-semibold text-brand uppercase">
              Sold out
            </span>
          ) : null}
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="font-eyebrow rounded-sm bg-tint px-1.5 py-0.5 text-[9px] font-semibold text-brand uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      <div className="flex shrink-0 items-start pt-0.5">
        {soldOut ? (
          <span className="size-11" aria-hidden />
        ) : customise || quantity === 0 ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (customise) openCustomise(item.id, item);
              else addSimple();
            }}
            className="ui-press inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-brand hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label={
              customise ? `Customise ${item.name}` : `Add ${item.name}`
            }
          >
            <Plus className="size-4" aria-hidden />
          </button>
        ) : (
          <div className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-white px-1">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              aria-label={`Decrease ${item.name}`}
              onClick={() => setQuantity(simpleKey, quantity - 1)}
            >
              <Minus className="size-3.5" aria-hidden />
            </button>
            <span className="min-w-5 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              aria-label={`Increase ${item.name}`}
              onClick={() => setQuantity(simpleKey, quantity + 1)}
            >
              <Plus className="size-3.5" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
