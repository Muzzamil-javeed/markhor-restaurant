import { menu } from "@/data/menu";
import type { MenuItem } from "@/data/menu-types";
import { computeCartTotals } from "@/lib/cart-totals";
import { prisma } from "@/lib/db";
import {
  isSelectionValid,
  lineTotal,
  selectionSummary,
  unitPrice,
  type ItemSelection,
} from "@/lib/pricing";
import type { OrderType } from "@/lib/vouchers";

const staticItemsById = new Map(
  menu.flatMap((category) => category.items).map((item) => [item.id, item]),
);

export type ClientCartLine = {
  itemId: string;
  quantity: number;
  variantId?: string | null;
  choiceIds?: string[];
  addOnIds?: string[];
  note?: string;
};

export type PricedOrderLine = {
  itemId: string;
  name: string;
  summary: string | null;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  variantId: string | null;
  choiceIds: string[];
  addOnIds: string[];
  note: string | null;
};

export type RepriceResult =
  | {
      ok: true;
      lines: PricedOrderLine[];
      totals: ReturnType<typeof computeCartTotals>;
    }
  | { ok: false; reason: string };

function selectionFromLine(item: MenuItem, line: ClientCartLine): ItemSelection {
  return {
    variantId: line.variantId ?? item.variants?.[0]?.id ?? null,
    choiceIds: line.choiceIds ?? [],
    addOnIds: line.addOnIds ?? [],
    note: line.note?.trim() ?? "",
    quantity: line.quantity,
  };
}

function applyOverride(
  item: MenuItem,
  override: {
    available: boolean;
    hidden?: boolean;
    priceOverride: number | null;
  } | null,
): MenuItem {
  if (!override) return item;
  return {
    ...item,
    available: override.hidden ? false : override.available,
    price: override.priceOverride ?? item.price,
    variants: item.variants?.map((variant) =>
      override.priceOverride != null && item.variants?.length === 1
        ? { ...variant, price: override.priceOverride }
        : variant,
    ),
  };
}

/** Server-side source of truth: reprice from menu.ts + MenuOverride. */
export async function repriceOrder(input: {
  lines: ClientCartLine[];
  orderType: OrderType;
  voucherCode?: string | null;
  now?: Date;
}): Promise<RepriceResult> {
  if (!input.lines.length) {
    return { ok: false, reason: "Your cart is empty." };
  }

  const itemIds = input.lines.map((line) => line.itemId);
  const [overrides, customs] = await Promise.all([
    prisma.menuOverride.findMany({
      where: { itemId: { in: itemIds } },
    }),
    prisma.menuCustomItem.findMany({
      where: { id: { in: itemIds } },
    }),
  ]);
  const overrideById = new Map(
    overrides.map((entry) => [entry.itemId, entry] as const),
  );
  const customById = new Map(customs.map((entry) => [entry.id, entry]));

  const priced: PricedOrderLine[] = [];

  for (const line of input.lines) {
    const custom = customById.get(line.itemId);
    const base: MenuItem | undefined = custom
      ? {
          id: custom.id,
          slug: custom.slug,
          name: custom.name,
          description: custom.description ?? undefined,
          price: custom.price,
          available: custom.hidden ? false : custom.available,
        }
      : staticItemsById.get(line.itemId);
    if (!base) {
      return { ok: false, reason: `Unknown menu item: ${line.itemId}` };
    }

    const item = custom
      ? base
      : applyOverride(base, overrideById.get(line.itemId) ?? null);

    if (!item.available) {
      return {
        ok: false,
        reason: `${item.name} is currently unavailable.`,
      };
    }

    const quantity = Math.min(20, Math.max(1, Math.round(line.quantity)));
    const selection = selectionFromLine(item, { ...line, quantity });
    if (!isSelectionValid(item, selection)) {
      return {
        ok: false,
        reason: `${item.name} is missing required options.`,
      };
    }

    const unit = unitPrice(item, selection);
    const total = lineTotal(item, selection, quantity);
    const summary = selectionSummary(item, selection);
    const variantLabel =
      item.variants?.find((entry) => entry.id === selection.variantId)
        ?.label ?? null;

    priced.push({
      itemId: item.id,
      name: item.name,
      summary: summary || null,
      variantLabel,
      unitPrice: unit,
      quantity,
      lineTotal: total,
      variantId: selection.variantId,
      choiceIds: selection.choiceIds,
      addOnIds: selection.addOnIds,
      note: selection.note || null,
    });
  }

  const totals = computeCartTotals({
    lines: priced.map((line) => ({
      unitPrice: line.unitPrice,
      quantity: line.quantity,
    })),
    orderType: input.orderType,
    voucherCode: input.voucherCode,
    now: input.now ?? new Date(),
  });

  if (totals.voucherError && input.voucherCode?.trim()) {
    return { ok: false, reason: totals.voucherError };
  }

  return { ok: true, lines: priced, totals };
}

/** Sync helper for unit tests that mock overrides out. */
export function repriceOrderSync(input: {
  lines: ClientCartLine[];
  orderType: OrderType;
  voucherCode?: string | null;
  now?: Date;
  overrides?: Map<string, { available: boolean; priceOverride: number | null }>;
}): RepriceResult {
  if (!input.lines.length) {
    return { ok: false, reason: "Your cart is empty." };
  }

  const priced: PricedOrderLine[] = [];

  for (const line of input.lines) {
    const base = staticItemsById.get(line.itemId);
    if (!base) {
      return { ok: false, reason: `Unknown menu item: ${line.itemId}` };
    }
    const item = applyOverride(
      base,
      input.overrides?.get(line.itemId) ?? null,
    );
    if (!item.available) {
      return {
        ok: false,
        reason: `${item.name} is currently unavailable.`,
      };
    }

    const quantity = Math.min(20, Math.max(1, Math.round(line.quantity)));
    const selection = selectionFromLine(item, { ...line, quantity });
    if (!isSelectionValid(item, selection)) {
      return {
        ok: false,
        reason: `${item.name} is missing required options.`,
      };
    }

    const unit = unitPrice(item, selection);
    const total = lineTotal(item, selection, quantity);
    const summary = selectionSummary(item, selection);
    const variantLabel =
      item.variants?.find((entry) => entry.id === selection.variantId)
        ?.label ?? null;

    priced.push({
      itemId: item.id,
      name: item.name,
      summary: summary || null,
      variantLabel,
      unitPrice: unit,
      quantity,
      lineTotal: total,
      variantId: selection.variantId,
      choiceIds: selection.choiceIds,
      addOnIds: selection.addOnIds,
      note: selection.note || null,
    });
  }

  const totals = computeCartTotals({
    lines: priced.map((line) => ({
      unitPrice: line.unitPrice,
      quantity: line.quantity,
    })),
    orderType: input.orderType,
    voucherCode: input.voucherCode,
    now: input.now ?? new Date(),
  });

  if (totals.voucherError && input.voucherCode?.trim()) {
    return { ok: false, reason: totals.voucherError };
  }

  return { ok: true, lines: priced, totals };
}
