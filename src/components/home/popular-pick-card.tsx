"use client";

import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MenuImage } from "@/components/menu/menu-image";
import { useResolvedMenuImage } from "@/components/menu/menu-image-map-provider";
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
import { useToastStore } from "@/store/toast";

const ease = [0.22, 1, 0.36, 1] as const;

export function PopularPickCard({
  item,
  index,
}: {
  item: MenuItem;
  index: number;
}) {
  const reduce = useReducedMotion();
  const addItem = useCartStore((state) => state.addItem);
  const openCustomise = useCustomiseStore((state) => state.open);
  const showToast = useToastStore((state) => state.show);
  const resolvedImage = useResolvedMenuImage({
    id: item.id,
    slug: item.slug,
  });
  const price = item.variants?.length
    ? Math.min(...item.variants.map((v) => v.price))
    : item.price;

  const onAdd = () => {
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
  };

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease }}
      className="list-none"
    >
      <motion.article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.35rem]",
          "bg-[#1A1314] border border-brand/70",
          "shadow-[0_12px_32px_rgba(94,15,29,0.45),0_0_0_1px_rgba(94,15,29,0.3)]",
          "transition-[border-color,box-shadow] duration-300",
          "hover:border-brand hover:shadow-[0_16px_40px_rgba(94,15,29,0.6),0_0_0_1px_rgba(94,15,29,0.5)]",
        )}
        whileHover={reduce ? undefined : { y: -8, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Full photo with exact 20px inset from card edges */}
        <div className="relative p-[20px] pb-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem]">
            <motion.div
              className="absolute inset-0"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <MenuImage
                name={item.name}
                slug={item.slug}
                itemId={item.id}
                overlay={false}
                rounded="rounded-none"
                priority={index < 3}
                className="!aspect-auto absolute inset-0 h-full w-full ring-0"
                sizes="(max-width: 640px) 90vw, 360px"
              />
            </motion.div>
          </div>
        </div>

        <div className="mt-auto flex flex-1 flex-col gap-3 p-[20px] pt-4">
          <div>
            <h3 className="font-display text-[1.05rem] leading-tight tracking-wide text-[#F6F4F2] uppercase sm:text-lg">
              {item.name}
            </h3>
            {item.description ? (
              <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#F6F4F2]/45">
                {item.description}
              </p>
            ) : (
              <p className="mt-2 text-[12px] leading-relaxed text-[#F6F4F2]/40">
                Smokehouse plate · Markhor DHA Phase 6
              </p>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <p className="font-display text-3xl leading-none tracking-tight text-[#F6F4F2]">
              <span className="mr-1 align-top text-sm text-white/70">Rs.</span>
              {formatPKR(price).replace(/^Rs\.\s*/, "")}
              {item.variants?.length ? (
                <span className="ml-1 text-xs font-sans tracking-normal text-[#F6F4F2]/40 normal-case">
                  from
                </span>
              ) : null}
            </p>

            <motion.button
              type="button"
              onClick={onAdd}
              whileHover={reduce ? undefined : { scale: 1.05 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className={cn(
                "group/btn relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full",
                "bg-brand text-on-brand shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_12px_28px_rgba(94,15,29,0.55)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              )}
              aria-label={`Add ${item.name}`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-all duration-700 group-hover/btn:left-[130%]"
              />
              <Plus
                className="relative size-5 transition-transform duration-500 group-hover/btn:rotate-90"
                aria-hidden
              />
            </motion.button>
          </div>
        </div>
      </motion.article>
    </motion.li>
  );
}
