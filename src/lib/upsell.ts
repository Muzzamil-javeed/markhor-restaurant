import { menu } from "@/data/menu";
import type { MenuItem } from "@/data/menu-types";

const UPSELL_CATEGORY_IDS = new Set([
  "complements-sides",
  "desserts",
  "cold-beverages",
  "hot-beverages",
]);

/** Suggest up to `limit` sides/drinks/desserts not already in the cart. */
export function suggestUpsells(
  cartItemIds: readonly string[],
  limit = 3,
): MenuItem[] {
  const inCart = new Set(cartItemIds);
  const pool = menu
    .filter((category) => UPSELL_CATEGORY_IDS.has(category.id))
    .flatMap((category) => category.items)
    .filter((item) => item.available && !inCart.has(item.id));

  return pool.slice(0, limit);
}
