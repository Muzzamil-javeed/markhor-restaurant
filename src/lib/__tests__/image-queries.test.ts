import { describe, expect, it } from "vitest";
import { menu } from "@/data/menu";
import {
  imageQueries,
  sharedGroupForSlug,
  SHARED_IMAGE_GROUPS,
} from "@/data/image-queries";
import { allMenuSlugs, getItemImage, hasImageQuery } from "@/data/images";

describe("menu image mappings", () => {
  const slugs = allMenuSlugs();

  it("covers all 116 menu items", () => {
    expect(slugs).toHaveLength(116);
  });

  it("fails if any item has no image query mapping", () => {
    const missing = slugs.filter((slug) => !hasImageQuery(slug));
    expect(missing, `Missing queries: ${missing.join(", ")}`).toEqual([]);
  });

  it("resolves getItemImage for every dish without throwing", () => {
    for (const category of menu) {
      for (const item of category.items) {
        const image = getItemImage({
          slug: item.slug,
          name: item.name,
          hasStockWebp: true,
        });
        expect(image.src).toBeTruthy();
        expect(image.alt).toBe(item.name);
        expect(image.source).toMatch(/stock|fallback|uploaded|gradient/);
      }
    }
  });

  it("only lists known slugs in shared groups", () => {
    const set = new Set(slugs);
    for (const members of Object.values(SHARED_IMAGE_GROUPS)) {
      for (const slug of members) {
        expect(set.has(slug)).toBe(true);
        expect(sharedGroupForSlug(slug)).toBeTruthy();
      }
    }
  });

  it("primary queries mention dark styling", () => {
    for (const slug of slugs) {
      const q = imageQueries[slug];
      expect(q?.primary.toLowerCase()).toContain("dark");
    }
  });
});
