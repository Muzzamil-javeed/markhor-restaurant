import type {
  Category,
  ChoiceGroup,
  MenuItem,
  Option,
  Variant,
} from "@/data/menu-types";
import { slugify } from "@/data/slug";

type ItemDetails = Partial<
  Pick<
    MenuItem,
    | "description"
    | "variants"
    | "choiceGroups"
    | "addOns"
    | "tags"
    | "available"
  >
>;

export function menuItem(
  name: string,
  price: number,
  details: ItemDetails = {},
): MenuItem {
  const slug = slugify(name);
  return {
    id: slug,
    slug,
    name,
    price,
    available: details.available ?? true,
    ...(details.description ? { description: details.description } : {}),
    ...(details.variants ? { variants: details.variants } : {}),
    ...(details.choiceGroups ? { choiceGroups: details.choiceGroups } : {}),
    ...(details.addOns ? { addOns: details.addOns } : {}),
    ...(details.tags ? { tags: details.tags } : {}),
  };
}

export function category(name: string, items: MenuItem[]): Category {
  return { id: slugify(name), name, items };
}

export function variants(
  itemName: string,
  pairs: readonly (readonly [label: string, price: number])[],
): Variant[] {
  return pairs.map(([label, price]) => ({
    id: slugify(`${itemName} ${label}`),
    label,
    price,
  }));
}

/** Included sauce. Price stays 0 because it is part of the item. */
export function sauceGroup(labels: readonly string[]): ChoiceGroup {
  return {
    id: "sauce",
    label: "Sauce",
    required: true,
    min: 1,
    max: 1,
    choices: labels.map((label) => ({
      id: slugify(label),
      label,
      price: 0,
    })),
  };
}

export function option(label: string, price: number): Option {
  return { id: slugify(label), label, price };
}
