/**
 * Slugs with a dedicated photo at `/public/images/menu/<slug>.jpg`.
 * Items not listed still get a dark stock food image (never a letter placeholder).
 */
export const menuPhotoSlugs = new Set<string>([
  "beef-brisket",
  "brisket-500g",
  "smoked-brisket-tacos",
  "brisket-burger-highway-man-style",
  "brisket-and-cream-cheese-stuffed-texas-twinkies",
  "brisket-loaded-fries",
  "loaded-baked-potato-with-brisket-and-cheese",
  "kansas-city-brisket-nachos",
  "beef-ribs-and-mac-burger",
  "midwest-smoked-pulled-beef-burger",
  "classic-texas-style-smoked-beef-burger",
  "beef-ribs",
  "the-beast",
  "beef-tenderloin-steak",
  "pastrami-on-rye",
  "angus-ribeye-grass-fed-aus",
  "filet-mignon",
  "beef-mushroom-melt",
  "philly-cheesesteak-burger",
  "butterflied-jumbo-prawns",
  "stone-grilled-chicken",
  "fresh-green-salad",
  "classic-mac-and-cheese",
]);

/** Dark food plates used when an item has no dedicated photo. */
export const STOCK_FOOD_IMAGES = [
  "/images/stock/dark-1.jpg",
  "/images/stock/dark-2.jpg",
  "/images/stock/dark-3.jpg",
  "/images/stock/dark-4.jpg",
  "/images/stock/dark-5.jpg",
  "/images/stock/dark-6.jpg",
  "/images/stock/dark-7.jpg",
  "/images/stock/dark-8.jpg",
  "/images/stock/dark-9.jpg",
  "/images/stock/dark-10.jpg",
  "/images/stock/dark-11.jpg",
  "/images/stock/dark-12.jpg",
  "/images/stock/dark-13.jpg",
  "/images/stock/dark-14.jpg",
  "/images/stock/dark-15.jpg",
  "/images/stock/dark-16.jpg",
  "/images/stock/dark-17.jpg",
  "/images/stock/dark-18.jpg",
  "/images/stock/dark-19.jpg",
  "/images/stock/dark-20.jpg",
  "/images/stock/dark-21.jpg",
  "/images/stock/dark-22.jpg",
  "/images/stock/dark-23.jpg",
  "/images/stock/dark-24.jpg",
  "/images/stock/dark-25.jpg",
] as const;

export function stockImageForSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % 997;
  }
  return STOCK_FOOD_IMAGES[hash % STOCK_FOOD_IMAGES.length]!;
}
