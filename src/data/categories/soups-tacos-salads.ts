import { category, menuItem } from "@/data/menu-build";

export const soups = category("Soups", [
  menuItem("Cream of mushroom soup", 740),
  menuItem("Caveman beef broth", 910),
  menuItem("Fisherman's stew", 910),
  menuItem("Seafood chowder", 970),
]);

export const tacos = category("Tacos", [
  menuItem("Birria tacos", 1310, {
    description:
      "Slow braised pulled beef, mozzarella, jalapenos, fresh red salsa",
  }),
  menuItem("Smoked brisket tacos", 1210, {
    description:
      "Smoked pulled brisket, caramelized onions, jalapenos, mozzarella, red salsa",
    tags: ["smoked"],
  }),
  menuItem("Caesar tacos", 1140, {
    description:
      "Grilled chicken, lettuce, egg, olives, croutons, parmesan, Caesar dressing",
  }),
  menuItem("Smoked chicken tacos", 1010, {
    description: "Smoked chicken, corn, jalapenos, mozzarella, red salsa",
    tags: ["smoked"],
  }),
  menuItem("Spicy shrimp taco", 1130, {
    description: "Smoked shrimp, jalapenos, corn, salsa, cheese",
    tags: ["spicy", "smoked"],
  }),
  menuItem("Smashed beef taco", 1210, {
    description: "Seared smashed beef, melted cheese, lettuce, house sauce",
  }),
]);

export const salads = category("Fresh salads", [
  menuItem("Smoked chicken salad", 1120, {
    description:
      "Smoked chicken, baby greens, roasted nuts, olives, parmesan, vinaigrette",
    tags: ["smoked"],
  }),
  menuItem("Caesar salad", 1210, {
    description:
      "Grilled chicken, olives, egg, croutons, parmesan Caesar dressing",
  }),
  menuItem("Smoked pastrami salad", 1240, {
    description:
      "Lettuce, olives, rocket, red onion, cucumber, nuts, shaved pastrami, basil lemon mustard dressing",
    tags: ["smoked"],
  }),
  menuItem("Fresh green salad", 810, {
    description:
      "Lettuce, basil, rocket, olives, nuts, onion rings, vinaigrette",
  }),
]);
