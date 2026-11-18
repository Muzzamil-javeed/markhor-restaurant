import { describe, expect, it } from "vitest";
import {
  MEAL_UPSELL_CATEGORIES,
  suggestSoftDrinkUpsells,
  suggestUpsells,
} from "@/lib/upsell";

describe("upsell suggestions", () => {
  it("returns meal sides/desserts not in the cart", () => {
    const first = suggestUpsells([], 3, MEAL_UPSELL_CATEGORIES);
    expect(first).toHaveLength(3);

    const ids = first.map((item) => item.id);
    const next = suggestUpsells(ids, 3, MEAL_UPSELL_CATEGORIES);
    expect(next).toHaveLength(3);
    expect(next.every((item) => !ids.includes(item.id))).toBe(true);
  });

  it("prioritises soft drink and water in soft drinks upsell", () => {
    const drinks = suggestSoftDrinkUpsells([], 15);
    expect(drinks.length).toBeGreaterThan(2);
    const ids = drinks.map((item) => item.id);
    expect(ids.slice(0, 3)).toEqual(
      expect.arrayContaining(["soft-drink", "water"]),
    );
    expect(ids).toContain("soft-drink");
    expect(ids).toContain("water");
  });
});
