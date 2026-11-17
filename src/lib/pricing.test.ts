import { describe, expect, it } from "vitest";
import { menu } from "@/data/menu";
import {
  buildLineKey,
  createDefaultSelection,
  isSelectionValid,
  lineTotal,
  toggleAddOn,
  toggleChoice,
  unitPrice,
  validateSelection,
} from "@/lib/pricing";

function itemBySlug(slug: string) {
  const item = menu.flatMap((category) => category.items).find((entry) => entry.slug === slug);
  if (!item) throw new Error(`Missing menu item: ${slug}`);
  return item;
}

describe("pricing", () => {
  it("requires a sauce for Wings on fire before add is valid", () => {
    const wings = itemBySlug("wings-on-fire");
    const selection = createDefaultSelection(wings);

    expect(isSelectionValid(wings, selection)).toBe(false);
    expect(validateSelection(wings, selection).groups.sauce).toMatch(/sauce/i);

    const withSauce = toggleChoice(wings, selection, "sauce", "nashville");
    expect(isSelectionValid(wings, withSauce)).toBe(true);
    expect(lineTotal(wings, withSauce, 1)).toBe(1340);
    expect(lineTotal(wings, withSauce, 2)).toBe(2680);
  });

  it("switches Yaki udon price by protein variant", () => {
    const udon = itemBySlug("yaki-udon");
    const chicken = createDefaultSelection(udon);
    expect(chicken.variantId).toBe("yaki-udon-chicken");
    expect(unitPrice(udon, chicken)).toBe(1510);
    expect(lineTotal(udon, chicken, 1)).toBe(1510);

    const beef = {
      ...chicken,
      variantId: "yaki-udon-beef",
    };
    expect(unitPrice(udon, beef)).toBe(1570);

    const prawn = {
      ...chicken,
      variantId: "yaki-udon-prawn",
    };
    expect(unitPrice(udon, prawn)).toBe(1610);
  });

  it("adds burger fries at +Rs. 250", () => {
    const burger = itemBySlug("midwest-smoked-pulled-beef-burger");
    const base = createDefaultSelection(burger);
    expect(unitPrice(burger, base)).toBe(1240);

    const withFries = toggleAddOn(base, "add-fries");
    expect(unitPrice(burger, withFries)).toBe(1490);
    expect(lineTotal(burger, withFries, 2)).toBe(2980);
  });

  it("builds stable line keys that merge identical selections", () => {
    const wings = itemBySlug("wings-on-fire");
    const a = toggleChoice(
      wings,
      createDefaultSelection(wings),
      "sauce",
      "sweet-chilli",
    );
    const b = {
      ...a,
      choiceIds: ["sweet-chilli"],
      note: "  extra napkins  ",
    };
    const c = {
      ...a,
      choiceIds: ["sweet-chilli"],
      note: "extra napkins",
    };

    expect(buildLineKey(wings.id, b)).toBe(buildLineKey(wings.id, c));
    expect(buildLineKey(wings.id, a)).not.toBe(buildLineKey(wings.id, c));
  });
});
