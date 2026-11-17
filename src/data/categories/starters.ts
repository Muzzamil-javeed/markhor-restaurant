import { category, menuItem, sauceGroup } from "@/data/menu-build";

const wingSauces = [
  "Nashville",
  "Sweet chilli",
  "Flaming hot mango habanero",
  "Garlic parmesan",
] as const;

export const starters = category("Starters", [
  menuItem("Brisket and cream cheese stuffed Texas twinkies", 1210),
  menuItem("Steak fries with cheese", 1510),
  menuItem("Parmesan truffle fries", 1510),
  menuItem("Brisket loaded fries", 1540),
  menuItem("Loaded baked potato with brisket and cheese", 1310),
  menuItem("Wings on fire", 1340, {
    tags: ["spicy"],
    choiceGroups: [sauceGroup(wingSauces)],
  }),
  menuItem("Chicken tenders", 1220, {
    choiceGroups: [sauceGroup(wingSauces)],
  }),
  menuItem("Pastrami cheese toasties", 810),
  menuItem("Kansas City brisket nachos", 1610),
  menuItem("Nashville hot chicken tenders", 1240, { tags: ["spicy"] }),
  menuItem("Dynamite chicken fries", 1320, { tags: ["spicy"] }),
  menuItem("Nashville chicken fries", 1350, { tags: ["spicy"] }),
  menuItem("Dynamite chicken tenders", 1240, { tags: ["spicy"] }),
  menuItem("Dynamite prawns", 1220, { tags: ["spicy"] }),
  menuItem("French fries", 540),
  menuItem("Cheesy garlic bread", 740),
]);
