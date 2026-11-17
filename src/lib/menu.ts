import type { Category, MenuItem } from "@/data/menu-types";
import { formatPKR } from "@/lib/format";

export type MenuFilters = {
  query: string;
  spicy: boolean;
  smoked: boolean;
  under1000: boolean;
};

export function needsCustomisation(item: MenuItem): boolean {
  return Boolean(
    (item.variants && item.variants.length > 0) ||
      (item.choiceGroups && item.choiceGroups.length > 0) ||
      (item.addOns && item.addOns.length > 0),
  );
}

export function formatItemPrice(item: MenuItem): string {
  if (item.variants && item.variants.length > 0) {
    return `from ${formatPKR(item.price)}`;
  }
  return formatPKR(item.price);
}

export function itemMatchesFilters(
  item: MenuItem,
  filters: MenuFilters,
): boolean {
  const query = filters.query.trim().toLowerCase();
  if (query) {
    const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.spicy && !item.tags?.includes("spicy")) return false;
  if (filters.smoked && !item.tags?.includes("smoked")) return false;
  if (filters.under1000 && item.price >= 1000) return false;
  return true;
}

export function filterMenu(
  menu: Category[],
  filters: MenuFilters,
): Category[] {
  return menu
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => itemMatchesFilters(item, filters)),
    }))
    .filter((category) => category.items.length > 0);
}

export function countVisibleItems(categories: Category[]): number {
  return categories.reduce((sum, category) => sum + category.items.length, 0);
}
