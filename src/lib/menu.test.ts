import { describe, expect, it } from "vitest";
import { menu } from "@/data/menu";
import {
  filterMenu,
  formatItemPrice,
  needsCustomisation,
} from "@/lib/menu";

describe("menu helpers", () => {
  it("keeps all 14 categories and 116 items with empty filters", () => {
    const filtered = filterMenu(menu, {
      query: "",
      spicy: false,
      smoked: false,
      under1000: false,
    });
    expect(filtered).toHaveLength(14);
    expect(filtered.map((category) => category.items.length)).toEqual(
      menu.map((category) => category.items.length),
    );
  });

  it("matches search against name and description", () => {
    const byName = filterMenu(menu, {
      query: "birria",
      spicy: false,
      smoked: false,
      under1000: false,
    });
    expect(byName.flatMap((category) => category.items).map((item) => item.slug)).toEqual(
      expect.arrayContaining(["birria-tacos", "birria-ramen"]),
    );

    const byDescription = filterMenu(menu, {
      query: "apricot glaze",
      spicy: false,
      smoked: false,
      under1000: false,
    });
    expect(byDescription.flatMap((c) => c.items).map((i) => i.slug)).toContain(
      "beef-ribs",
    );
  });

  it("applies spicy, smoked, and under Rs. 1,000 filters", () => {
    const spicy = filterMenu(menu, {
      query: "",
      spicy: true,
      smoked: false,
      under1000: false,
    });
    expect(
      spicy.flatMap((c) => c.items).every((item) => item.tags?.includes("spicy")),
    ).toBe(true);

    const cheap = filterMenu(menu, {
      query: "",
      spicy: false,
      smoked: false,
      under1000: true,
    });
    expect(cheap.flatMap((c) => c.items).every((item) => item.price < 1000)).toBe(
      true,
    );
  });

  it("formats variant prices with from and detects customisation", () => {
    const water = menu
      .flatMap((c) => c.items)
      .find((item) => item.slug === "water");
    expect(water).toBeTruthy();
    expect(formatItemPrice(water!)).toBe("from Rs. 120");
    expect(needsCustomisation(water!)).toBe(true);

    const fries = menu
      .flatMap((c) => c.items)
      .find((item) => item.slug === "french-fries");
    expect(formatItemPrice(fries!)).toBe("Rs. 540");
    expect(needsCustomisation(fries!)).toBe(false);
  });
});
