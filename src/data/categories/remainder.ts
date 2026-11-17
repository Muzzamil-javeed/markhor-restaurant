import { category, menuItem, variants } from "@/data/menu-build";

export const meatOnly = category("Meat only", [
  menuItem("Brisket 500g", 4310, {
    description: "Served with habanero hellfire sauce",
    tags: ["smoked", "spicy"],
  }),
  menuItem("Pastrami 500g", 4540),
]);

export const sides = category("Complements / Sides", [
  menuItem("Butter garlic mash", 550),
  menuItem("Parmesan roasted potato wedges", 510),
  menuItem("Smoked bbq beans", 420, { tags: ["smoked"] }),
  menuItem("Seasoned corn", 540),
  menuItem("Smoky roasted garlic rice", 610),
  menuItem("Coleslaw", 180),
  menuItem("Rye bread slices", 200),
]);

export const sauces = category("Sauces", [
  menuItem("Habanero hell fire", 130, { tags: ["spicy"] }),
  menuItem("Eastern Carolina bbq sauce", 130),
  menuItem("Hot salsa", 130, { tags: ["spicy"] }),
  menuItem("Pineapple salsa", 130),
  menuItem("Creamy mustard", 130),
  menuItem("Sriracha mayo", 130, { tags: ["spicy"] }),
  menuItem("Honey mustard", 130),
  menuItem("Classic peppercorn steak sauce", 160),
  menuItem("Creamy mushroom steak sauce", 160),
]);

export const kids = category("Kids menu", [
  menuItem("Nuggets with french fries", 740),
  menuItem("Chicken pops with french fries", 710),
]);

export const desserts = category("Desserts", [
  menuItem("Burnt vanilla creme brulee", 950),
  menuItem("Island coconut ice cream", 610),
  menuItem("Mango bliss ice cream", 640),
  menuItem("Markhor molten chocolate cake", 740),
]);

export const coldDrinks = category("Cold beverages", [
  menuItem("Caramel cinnamon mojito", 730),
  menuItem("Mango and dragon fruit cooler", 710),
  menuItem("Coke float", 610),
  menuItem("Lychee rose spritz", 660),
  menuItem("Long Island peach iced tea", 560),
  menuItem("Strawberry lemonade", 640),
  menuItem("Virgin pina colada", 660),
  menuItem("Mint lemonade", 540),
  menuItem("Thirst burst", 440),
  menuItem("Red Bull", 640),
  menuItem("Red Bull mocktail", 810),
  menuItem("Sparkling water", 340),
  menuItem("Detox", 220),
  menuItem("Water", 120, {
    variants: variants("Water", [
      ["Small", 120],
      ["Large", 150],
    ]),
  }),
  menuItem("Soft drink", 210),
]);

export const hotDrinks = category("Hot beverages", [
  menuItem("Green tea", 310),
  menuItem("Tea", 310),
]);
