"use client";

import { useResolvedMenuImage } from "@/components/menu/menu-image-map-provider";
import { QtyStepper } from "@/components/menu/qty-stepper";
import type { MenuItem } from "@/data/menu-types";
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

type ItemWithImage = MenuItem & {
  imageSrc?: string | null;
};

export function MenuItemAdd({ item }: { item: ItemWithImage }) {
  const hydrated = useCartHydration();
  const lines = useCartStore((state) => state.lines);
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const openCustomise = useCustomiseStore((state) => state.open);
  const showToast = useToastStore((state) => state.show);
  const resolvedImage = useResolvedMenuImage({
    id: item.id,
    slug: item.slug,
    imageSrc: item.imageSrc,
  });

  const customise = needsCustomisation(item);
  const simpleKey = buildLineKey(item.id, createDefaultSelection(item));
  const quantity = hydrated
    ? (lines.find((line) => line.key === simpleKey)?.quantity ?? 0)
    : 0;
  const soldOut = !item.available;

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-tint/50 px-4 text-sm font-medium text-muted"
      >
        Not available
      </button>
    );
  }

  if (customise) {
    return (
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        onClick={() => openCustomise(item.id, item)}
      >
        Add
      </button>
    );
  }

  if (quantity > 0) {
    return (
      <QtyStepper
        label={item.name}
        value={quantity}
        onDecrease={() => setQuantity(simpleKey, quantity - 1)}
        onIncrease={() => setQuantity(simpleKey, quantity + 1)}
        className="w-full justify-between"
      />
    );
  }

  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      aria-label={`Add ${item.name} to cart`}
      onClick={() => {
        const selection = createDefaultSelection(item);
        addItem({
          key: simpleKey,
          itemId: item.id,
          name: item.name,
          unitPrice: unitPrice(item, selection),
          imageSrc: resolvedImage?.imageSrc ?? null,
        });
        showToast(`Added ${item.name}`);
      }}
    >
      Add
    </button>
  );
}
