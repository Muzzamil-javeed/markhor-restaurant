import { menu } from "@/data/menu";
import type { MenuItem } from "@/data/menu";

/** Signature home-page picks, in display order. */
export const POPULAR_SLUGS = [
  "birria-tacos",
  "the-beast",
  "smoked-brisket-tacos",
  "spicy-shrimp-taco",
  "beef-ribs",
  "smoked-chicken-tacos",
] as const;

const bySlug = new Map(
  menu.flatMap((category) => category.items).map((item) => [item.slug, item]),
);

export const popularPicks: MenuItem[] = POPULAR_SLUGS.map((slug) => {
  const item = bySlug.get(slug);
  if (!item) {
    throw new Error(`Popular pick missing from menu data: ${slug}`);
  }
  return item;
});
