import { menu } from "@/data/menu";
import type { MenuItem } from "@/data/menu-types";

export const MEAL_UPSELL_CATEGORIES = [
  "complements-sides",
  "desserts",
  "hot-beverages",
] as const;

export const SOFT_DRINK_UPSELL_CATEGORIES = ["cold-beverages"] as const;

/** Put classic soft drinks / water first so cart slider shows them early. */
const SOFT_DRINK_PRIORITY = [
  "soft-drink",
  "water",
  "sparkling-water",
  "coke-float",
  "red-bull",
  "thirst-burst",
  "detox",
] as const;

function priorityRank(itemId: string, priority: readonly string[]): number {
  const index = priority.indexOf(itemId);
  return index === -1 ? priority.length + 1 : index;
}

/** Suggest up to `limit` items from the given categories, not already in the cart. */
export function suggestUpsells(
  cartItemIds: readonly string[],
  limit = 3,
  categoryIds: readonly string[] = MEAL_UPSELL_CATEGORIES,
  priorityIds: readonly string[] = [],
): MenuItem[] {
  const allowed = new Set(categoryIds);
  const inCart = new Set(cartItemIds);
  const pool = menu
    .filter((category) => allowed.has(category.id))
    .flatMap((category) => category.items)
    .filter((item) => item.available && !inCart.has(item.id));

  if (priorityIds.length > 0) {
    pool.sort(
      (a, b) =>
        priorityRank(a.id, priorityIds) - priorityRank(b.id, priorityIds),
    );
  }

  return pool.slice(0, limit);
}

export function suggestSoftDrinkUpsells(
  cartItemIds: readonly string[],
  limit = 15,
): MenuItem[] {
  return suggestUpsells(
    cartItemIds,
    limit,
    SOFT_DRINK_UPSELL_CATEGORIES,
    SOFT_DRINK_PRIORITY,
  );
}
