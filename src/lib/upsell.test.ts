import { describe, expect, it } from "vitest";
import { suggestUpsells } from "@/lib/upsell";

describe("upsell suggestions", () => {
  it("returns up to three sides, drinks, or desserts not in the cart", () => {
    const first = suggestUpsells([]);
    expect(first).toHaveLength(3);

    const ids = first.map((item) => item.id);
    const next = suggestUpsells(ids);
    expect(next).toHaveLength(3);
    expect(next.every((item) => !ids.includes(item.id))).toBe(true);
  });
});
