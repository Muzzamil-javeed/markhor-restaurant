import { describe, expect, it } from "vitest";
import { menu } from "@/data/menu";
import { slugify } from "@/data/slug";

const expectedCounts: readonly (readonly [string, number])[] = [
  ["Starters", 16],
  ["Soups", 4],
  ["Tacos", 6],
  ["Fresh salads", 4],
  ["Beef, chicken and seafood mains", 19],
  ["Pastas", 10],
  ["Burgers and sandwiches", 16],
  ["Meat only", 2],
  ["Complements / Sides", 7],
  ["Sauces", 9],
  ["Kids menu", 2],
  ["Desserts", 4],
  ["Cold beverages", 15],
  ["Hot beverages", 2],
];

const items = () => menu.flatMap((category) => category.items);

const noExtraPatty = [
  "croissant-lineup",
  "korean-chicken-burger",
  "nashville-chicken-burger",
  "crispy-chicken-burger",
  "chicken-fillet-burger",
  "pitboss-chickwich-club",
  "smoked-chicken-and-corn-beef-pepper-jack",
];

describe("menu data", () => {
  it("matches the category order and item counts", () => {
    expect(menu.map((category) => [category.name, category.items.length])).toEqual(
      expectedCounts.map(([name, count]) => [name, count]),
    );
  });

  it("gives every item an id, slug, and integer rupee price", () => {
    for (const category of menu) {
      expect(category.id).toBe(slugify(category.name));
      expect(category.id.length).toBeGreaterThan(0);

      for (const item of category.items) {
        expect(item.id.length).toBeGreaterThan(0);
        expect(item.slug).toBe(item.id);
        expect(item.slug).toBe(slugify(item.name));
        expect(Number.isInteger(item.price)).toBe(true);
        expect(item.price).toBeGreaterThan(0);
        expect(typeof item.available).toBe("boolean");
      }
    }
  });

  it("has no duplicate category or item ids", () => {
    const categoryIds = menu.map((category) => category.id);
    const itemIds = items().map((item) => item.id);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(new Set(itemIds).size).toBe(itemIds.length);
    expect(itemIds).toHaveLength(116);
  });

  it("stores the lowest variant price as the base price", () => {
    for (const item of items()) {
      if (!item.variants?.length) continue;
      const variantIds = item.variants.map((variant) => variant.id);
      expect(new Set(variantIds).size).toBe(variantIds.length);
      const lowest = Math.min(...item.variants.map((variant) => variant.price));
      expect(item.price).toBe(lowest);
      for (const variant of item.variants) {
        expect(Number.isInteger(variant.price)).toBe(true);
      }
    }
  });

  it("requires one sauce on wings, tenders, smoked chicken breast, and stone grilled chicken", () => {
    const bySlug = Object.fromEntries(items().map((item) => [item.slug, item]));

    for (const slug of ["wings-on-fire", "chicken-tenders"]) {
      const group = bySlug[slug]?.choiceGroups?.[0];
      expect(group).toMatchObject({ required: true, min: 1, max: 1, label: "Sauce" });
      expect(group?.choices.map((choice) => choice.label)).toEqual([
        "Nashville",
        "Sweet chilli",
        "Flaming hot mango habanero",
        "Garlic parmesan",
      ]);
    }

    expect(
      bySlug["smoked-chicken-breast"]?.choiceGroups?.[0]?.choices.map(
        (choice) => choice.label,
      ),
    ).toEqual(["Habanero hell fire", "Mushroom and spinach", "Pineapple salsa"]);

    expect(
      bySlug["stone-grilled-chicken"]?.choiceGroups?.[0]?.choices.map(
        (choice) => choice.label,
      ),
    ).toEqual(["Habanero hell fire", "Cream and herbs"]);
  });

  it("adds fries to every burger, and holds extra patty off chicken and croissants", () => {
    const burgers = menu.find((category) => category.id === "burgers-and-sandwiches");
    expect(burgers?.items).toHaveLength(16);

    for (const item of burgers?.items ?? []) {
      const addOnIds = item.addOns?.map((addOn) => addOn.id) ?? [];
      expect(addOnIds).toEqual(expect.arrayContaining(["add-fries", "curly-fries"]));
      expect(item.addOns?.find((addOn) => addOn.id === "add-fries")?.price).toBe(250);
      expect(item.addOns?.find((addOn) => addOn.id === "curly-fries")?.price).toBe(300);

      if (noExtraPatty.includes(item.slug)) {
        expect(addOnIds).not.toContain("extra-patty");
      } else {
        expect(item.addOns?.find((addOn) => addOn.id === "extra-patty")?.price).toBe(350);
      }
    }

    const pastrami = burgers?.items.find((item) => item.slug === "pastrami-on-rye");
    expect(pastrami?.addOns?.find((addOn) => addOn.id === "extra-meat")).toMatchObject({
      label: "Extra meat",
      price: 0,
    });
  });
});
