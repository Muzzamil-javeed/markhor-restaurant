"use client";

import { MenuImage } from "@/components/menu/menu-image";
import { useResolvedMenuImage } from "@/components/menu/menu-image-map-provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { popularPicks } from "@/data/popular";
import type { MenuItem } from "@/data/menu-types";
import { formatItemPrice, needsCustomisation } from "@/lib/menu";
import {
  buildLineKey,
  createDefaultSelection,
  unitPrice,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { useCustomiseStore } from "@/store/customise";
import { useToastStore } from "@/store/toast";

function PopularPickCard({
  item,
  index,
}: {
  item: MenuItem;
  index: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const openCustomise = useCustomiseStore((state) => state.open);
  const showToast = useToastStore((state) => state.show);
  const resolvedImage = useResolvedMenuImage({
    id: item.id,
    slug: item.slug,
  });

  return (
    <Reveal delay={index * 0.04}>
      <li className="ui-card flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
        <MenuImage
          name={item.name}
          slug={item.slug}
          itemId={item.id}
          rounded="rounded-none"
          priority={index < 3}
        />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="text-base font-semibold text-ink">{item.name}</h3>
            <p className="mt-1 text-sm tabular-nums text-muted">
              {formatItemPrice(item)}
            </p>
          </div>
          <button
            type="button"
            className="ui-press mt-auto inline-flex h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            onClick={() => {
              if (needsCustomisation(item)) {
                openCustomise(item.id, {
                  ...item,
                  imageSrc: resolvedImage?.imageSrc ?? null,
                });
                return;
              }
              const selection = createDefaultSelection(item);
              addItem({
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
    </Reveal>
  );
}

export function HomePopularPicks() {
  return (
    <section className="paper-texture bg-[#ebe3de]">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-16 lg:py-20">
        <Reveal>
          <SectionEyebrow>Crowd favourites</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Popular picks.
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularPicks.map((item, index) => (
            <PopularPickCard key={item.id} item={item} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
