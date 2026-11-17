import { describe, expect, it } from "vitest";
import { POPULAR_SLUGS, popularPicks } from "@/data/popular";

describe("popular picks", () => {
  it("resolves exactly six signature menu items", () => {
    expect(POPULAR_SLUGS).toHaveLength(6);
    expect(popularPicks.map((item) => item.slug)).toEqual([...POPULAR_SLUGS]);
    expect(popularPicks.every((item) => item.price > 0)).toBe(true);
  });
});
