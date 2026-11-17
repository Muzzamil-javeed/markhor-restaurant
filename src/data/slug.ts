/** Stable id/slug from a menu name. Apostrophes drop out; other punctuation becomes hyphens. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
