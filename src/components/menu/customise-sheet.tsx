"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { X } from "lucide-react";
import { CustomiseOptions } from "@/components/menu/customise-options";
import { MenuImage } from "@/components/menu/menu-image";
import { useResolvedMenuImage } from "@/components/menu/menu-image-map-provider";
import { QtyStepper } from "@/components/menu/qty-stepper";
import { menu } from "@/data/menu";
import type { MenuItem } from "@/data/menu-types";
import { site } from "@/data/site";
import { formatPKR } from "@/lib/format";
import {
  buildLineKey,
  createDefaultSelection,
  isSelectionValid,
  lineTotal,
  selectionSummary,
  unitPrice,
  validateSelection,
  type ItemSelection,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { useCustomiseStore } from "@/store/customise";
import { useToastStore } from "@/store/toast";

const itemsById = new Map(
  menu.flatMap((category) => category.items).map((item) => [item.id, item]),
);

export function CustomiseSheet() {
  const itemId = useCustomiseStore((state) => state.itemId);
  const snapshot = useCustomiseStore((state) => state.itemSnapshot);
  if (!itemId) return null;
  const item = snapshot ?? itemsById.get(itemId) ?? null;
  if (!item) return null;
  return <CustomiseSheetPanel key={itemId} item={item} />;
}

type CustomiseItem = MenuItem & {
  imageSrc?: string | null;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
};

function itemUploadPaths(item: CustomiseItem) {
  return {
    imageSrc: item.imageSrc ?? null,
    imageSquareSrc: item.imageSquareSrc ?? null,
    imageThumbSrc: item.imageThumbSrc ?? null,
  };
}

function CustomiseSheetPanel({ item }: { item: CustomiseItem }) {
  const close = useCustomiseStore((state) => state.close);
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  const titleId = useId();
  const upload = itemUploadPaths(item);
  const resolvedImage = useResolvedMenuImage({
    id: item.id,
    slug: item.slug,
    imageSrc: upload.imageSrc,
    imageSquareSrc: upload.imageSquareSrc,
    imageThumbSrc: upload.imageThumbSrc,
  });
  const [selection, setSelection] = useState<ItemSelection>(() =>
    createDefaultSelection(item),
  );
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const errors = useMemo(
    () => validateSelection(item, selection),
    [item, selection],
  );
  const total = lineTotal(item, selection);
  const perUnit = unitPrice(item, selection);
  const valid = isSelectionValid(item, selection);

  const submit = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    const summary = selectionSummary(item, selection);
    addItem({
      key: buildLineKey(item.id, selection),
      itemId: item.id,
      name: item.name,
      summary: summary || undefined,
      unitPrice: perUnit,
      quantity: selection.quantity,
      imageSrc: resolvedImage?.imageSrc ?? null,
      variantId: selection.variantId,
      choiceIds: selection.choiceIds,
      addOnIds: selection.addOnIds,
      note: selection.note.trim() || undefined,
    });
    showToast(`Added ${item.name}`);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="animate-overlay-in absolute inset-0 bg-ink/45"
        aria-label="Close customise dialog"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-sheet-in relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-background shadow-xl sm:max-h-[85vh] sm:rounded-2xl"
      >
        <div className="flex justify-center pt-2 sm:hidden" aria-hidden>
          <span className="h-1.5 w-10 rounded-full bg-line" />
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-heading text-lg font-semibold text-ink"
            >
              {item.name}
            </h2>
            <p className="text-sm text-muted">{formatPKR(perUnit)} each</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <MenuImage
            name={item.name}
            slug={item.slug}
            itemId={item.id}
            imageSrc={upload.imageSrc}
            imageSquareSrc={upload.imageSquareSrc}
            imageThumbSrc={upload.imageThumbSrc}
            className="mb-4 aspect-[16/9]"
          />
          {item.description ? (
            <p className="mb-5 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          ) : null}

          <CustomiseOptions
            item={item}
            selection={selection}
            errors={errors}
            showErrors={showErrors}
            onChange={setSelection}
          />

          <div className="mt-6 flex flex-col gap-2">
            <label
              htmlFor={`${titleId}-note`}
              className="font-heading text-sm font-semibold text-ink"
            >
              Special instructions
            </label>
            <textarea
              id={`${titleId}-note`}
              value={selection.note}
              maxLength={200}
              rows={3}
              onChange={(event) =>
                setSelection({ ...selection, note: event.target.value })
              }
              placeholder="No onions, extra sauce…"
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-brand/40"
            />
            <p className="text-xs text-muted">
              {selection.note.length}/200
              {showErrors && errors.note ? (
                <span className="ml-2 text-destructive" role="alert">
                  {errors.note}
                </span>
              ) : null}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="font-heading text-sm font-semibold text-ink">
              Quantity
            </p>
            <QtyStepper
              label={item.name}
              value={selection.quantity}
              onDecrease={() =>
                setSelection({
                  ...selection,
                  quantity: Math.max(1, selection.quantity - 1),
                })
              }
              onIncrease={() =>
                setSelection({
                  ...selection,
                  quantity: Math.min(20, selection.quantity + 1),
                })
              }
            />
          </div>
          {showErrors && errors.quantity ? (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {errors.quantity}
            </p>
          ) : null}

          <p className="mt-4 text-xs text-muted">{site.footer.note}</p>
        </div>

        <div className="border-t border-line p-4">
          <button
            type="button"
            onClick={submit}
            className="ui-press inline-flex h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Add to cart · {formatPKR(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
