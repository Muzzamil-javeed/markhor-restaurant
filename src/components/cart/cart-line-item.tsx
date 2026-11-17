"use client";

import { Trash2 } from "lucide-react";
import { QtyStepper } from "@/components/menu/qty-stepper";
import { formatPKR } from "@/lib/format";
import { useCartStore, type CartLine } from "@/store/cart";

export function CartLineItem({ line }: { line: CartLine }) {
  const updateQty = useCartStore((state) => state.updateQty);
  const remove = useCartStore((state) => state.remove);
  const lineTotal = line.unitPrice * line.quantity;

  return (
    <li className="flex flex-col gap-3 border-b border-line py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-ink">
            {line.name}
          </p>
          {line.summary ? (
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {line.summary}
            </p>
          ) : null}
          {line.note ? (
            <p className="mt-1 text-xs italic text-muted">Note: {line.note}</p>
          ) : null}
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
          {formatPKR(lineTotal)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
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
          className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:bg-tint hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          aria-label={`Remove ${line.name} from cart`}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
