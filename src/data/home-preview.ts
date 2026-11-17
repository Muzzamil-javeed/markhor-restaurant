import { menu } from "@/data/menu";
import type { MenuItem } from "@/data/menu-types";

const bySlug = new Map(
  menu.flatMap((category) => category.items).map((item) => [item.slug, item]),
);

function pick(slugs: string[]): MenuItem[] {
  return slugs.map((slug) => {
    const item = bySlug.get(slug);
    if (!item) throw new Error(`Home preview missing: ${slug}`);
    return item;
  });
}

/** Curated dotted-leader groups for the home menu preview. */
export const homeMenuPreview = [
  {
    id: "burgers",
    name: "Burgers",
    items: pick([
      "the-beast",
      "brisket-burger-highway-man-style",
      "classic-texas-style-smoked-beef-burger",
      "pastrami-on-rye",
    ]),
  },
  {
    id: "mains",
    name: "Mains",
    items: pick([
      "beef-brisket",
      "beef-ribs",
      "beef-tenderloin-steak",
      "smoked-chicken-breast",
    ]),
  },
  {
    id: "tacos",
    name: "Tacos",
    items: pick([
      "smoked-brisket-tacos",
      "birria-tacos",
      "smoked-chicken-tacos",
    ]),
  },
  {
    id: "sides-sweets",
    name: "Sides & sweets",
    items: pick([
      "classic-mac-and-cheese",
      "french-fries",
      "cheesy-garlic-bread",
    ]),
  },
] as const;
