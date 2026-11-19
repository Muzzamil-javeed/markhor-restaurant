"use client";

import { useId, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuImage } from "@/components/menu/menu-image";
import { useResolvedMenuImage } from "@/components/menu/menu-image-map-provider";
import { cn } from "@/lib/cn";
import { formatPKR } from "@/lib/format";
import { needsCustomisation } from "@/lib/menu";
import {
  buildLineKey,
  createDefaultSelection,
  unitPrice,
} from "@/lib/pricing";
import {
  MEAL_UPSELL_CATEGORIES,
  suggestSoftDrinkUpsells,
  suggestUpsells,
} from "@/lib/upsell";
import type { MenuItem } from "@/data/menu-types";
import { useCartStore } from "@/store/cart";
import { useCustomiseStore } from "@/store/customise";
import { useToastStore } from "@/store/toast";

type CartUpsellProps = {
  tone?: "light" | "dark";
  title: string;
  suggestions: MenuItem[];
};

function UpsellCard({
  item,
  dark,
}: {
  item: MenuItem;
  dark: boolean;
}) {
  const add = useCartStore((state) => state.add);
  const openCustomise = useCustomiseStore((state) => state.open);
  const showToast = useToastStore((state) => state.show);
  const resolvedImage = useResolvedMenuImage({
    id: item.id,
    slug: item.slug,
  });

  return (
    <li
      className={cn(
        "flex w-[10.75rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border",
        dark
          ? "border-cream/12 bg-[#140D0E]"
          : "w-[13.5rem] border-line bg-white p-3",
      )}
    >
      {dark ? (
        <MenuImage
          name={item.name}
          slug={item.slug}
          itemId={item.id}
          imageSrc={resolvedImage?.imageSrc}
          imageSquareSrc={resolvedImage?.imageSquareSrc}
          imageThumbSrc={resolvedImage?.imageThumbSrc}
          rounded="rounded-none"
          className="aspect-[4/3] shrink-0"
        />
      ) : null}
      <div className={cn("flex min-h-0 flex-1 flex-col gap-2.5", dark && "p-3")}>
        <div className={cn("min-w-0", !dark && "flex items-start gap-2.5")}>
          {!dark ? (
            <MenuImage
              name={item.name}
              slug={item.slug}
              itemId={item.id}
              imageSrc={resolvedImage?.imageSrc}
              imageSquareSrc={resolvedImage?.imageSquareSrc}
              imageThumbSrc={resolvedImage?.imageThumbSrc}
              ratio="square"
              rounded="rounded-xl"
              overlay={false}
              className="size-12 shrink-0 !aspect-square"
              sizes="48px"
            />
          ) : null}
          <div className="min-w-0 flex-1">
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
              openCustomise(item.id, {
                ...item,
                imageSrc: resolvedImage?.imageSrc ?? null,
              });
              return;
            }
            const selection = createDefaultSelection(item);
            add({
              key: buildLineKey(item.id, selection),
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
      </div>
    </li>
  );
}

function CartUpsellRail({ tone = "light", title, suggestions }: CartUpsellProps) {
  const dark = tone === "dark";
  const titleId = useId();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const showArrows = suggestions.length > 2;

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = (card?.clientWidth ?? 180) + 12;
    el.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  };

  if (suggestions.length === 0) return null;

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3
          id={titleId}
          className={cn(
            "font-eyebrow text-[10px] font-semibold tracking-[0.18em] uppercase",
            dark
              ? "text-cream/45"
              : "font-heading text-sm tracking-normal text-ink normal-case",
          )}
        >
          {title}
        </h3>
        {showArrows ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Previous ${title}`}
              onClick={() => scrollByCard(-1)}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2",
                dark
                  ? "border-cream/25 text-cream hover:bg-cream/10 focus-visible:ring-cream/40"
                  : "border-line text-ink hover:bg-tint focus-visible:ring-brand/40",
              )}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={`Next ${title}`}
              onClick={() => scrollByCard(1)}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2",
                dark
                  ? "border-cream/25 text-cream hover:bg-cream/10 focus-visible:ring-cream/40"
                  : "border-line text-ink hover:bg-tint focus-visible:ring-brand/40",
              )}
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <ul
        ref={scrollerRef}
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "pe-1",
        )}
      >
        {suggestions.map((item) => (
          <UpsellCard key={item.id} item={item} dark={dark} />
        ))}
      </ul>
    </section>
  );
}

export function CartUpsellBlocks({ tone = "light" }: { tone?: "light" | "dark" }) {
  const lines = useCartStore((state) => state.lines);
  const cartIds = useMemo(() => lines.map((line) => line.itemId), [lines]);

  const mealSuggestions = useMemo(
    () => suggestUpsells(cartIds, 3, MEAL_UPSELL_CATEGORIES),
    [cartIds],
  );
  const drinkSuggestions = useMemo(
    () => suggestSoftDrinkUpsells(cartIds, 15),
    [cartIds],
  );

  return (
    <div className="flex flex-col gap-5">
      <CartUpsellRail
        tone={tone}
        title="Complete your meal"
        suggestions={mealSuggestions}
      />
      <CartUpsellRail
        tone={tone}
        title="Soft drinks"
        suggestions={drinkSuggestions}
      />
    </div>
  );
}
