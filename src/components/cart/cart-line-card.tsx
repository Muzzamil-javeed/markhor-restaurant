"use client";

import { Trash2 } from "lucide-react";
import { MenuImage } from "@/components/menu/menu-image";
import { QtyStepper } from "@/components/menu/qty-stepper";
import { formatPKR } from "@/lib/format";
import { useCartStore, type CartLine } from "@/store/cart";

export function CartLineCard({ line }: { line: CartLine }) {
  const updateQty = useCartStore((state) => state.updateQty);
  const remove = useCartStore((state) => state.remove);
  const lineTotal = line.unitPrice * line.quantity;
  const slug = line.itemId;

  return (
    <article className="flex gap-3 overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-[0_4px_14px_rgba(36,26,27,0.04)]">
      <MenuImage
        name={line.name}
        slug={slug}
        itemId={line.itemId}
        imageSrc={line.imageSrc}
        ratio="square"
        rounded="rounded-xl"
        className="size-20 shrink-0 !aspect-square"
        sizes="80px"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{line.name}</p>
            {line.summary ? (
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted">
                {line.summary}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
            {formatPKR(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <QtyStepper
            label={line.name}
            value={line.quantity}
            onDecrease={() => updateQty(line.key, line.quantity - 1)}
            onIncrease={() =>
              updateQty(line.key, Math.min(20, line.quantity + 1))
            }
          />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label={`Remove ${line.name} from cart`}
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
