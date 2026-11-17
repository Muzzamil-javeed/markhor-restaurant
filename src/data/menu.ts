import { burgers } from "@/data/categories/burgers";
import { mains } from "@/data/categories/mains";
import { pastas } from "@/data/categories/pastas";
import {
  coldDrinks,
  desserts,
  hotDrinks,
  kids,
  meatOnly,
  sauces,
  sides,
} from "@/data/categories/remainder";
import { soups, salads, tacos } from "@/data/categories/soups-tacos-salads";
import { starters } from "@/data/categories/starters";
import type {
  Category,
  ChoiceGroup,
  MenuItem,
  Option,
  Variant,
} from "@/data/menu-types";

export type { Category, ChoiceGroup, MenuItem, Option, Variant };

/** Single source of truth for the Markhor menu. Prices are integer rupees, exclusive of GST. */
export const menu: Category[] = [
  starters,
  soups,
  tacos,
  salads,
  mains,
  pastas,
  burgers,
  meatOnly,
  sides,
  sauces,
  kids,
  desserts,
  coldDrinks,
  hotDrinks,
];
