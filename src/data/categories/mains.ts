import { category, menuItem, sauceGroup, variants } from "@/data/menu-build";

export const mains = category("Beef, chicken and seafood mains", [
  menuItem("Filet mignon", 3690, {
    description:
      "300 to 350g on mashed potatoes, caramelized French onions, beef au jus",
  }),
  menuItem("Beef tenderloin steak", 3710, {
    description:
      "300 to 350g, reverse seared, rosemary and thyme, wild herb butter, pepper sauce",
  }),
  menuItem("Wild buffalo tenderloin steak", 3710, {
    description: "Steak and fries with wild buffalo butter sauce",
  }),
  menuItem("Steak and eggs", 2210, {
    description: "Grilled beef steak, two eggs, toasted bread, pepper sauce",
  }),
  menuItem("Angus ribeye (grass fed AUS)", 7410, {
    description:
      "300g imported, rosemary and thyme, wild herb butter, pepper sauce",
  }),
  menuItem("Beef brisket", 3210, {
    description: "Texas style, smoked 12 hours, 300g",
    tags: ["smoked"],
  }),
  menuItem("Beef ribs", 3510, {
    description: "Jumbo, smoked 12 hours, house rub, bbq apricot glaze",
    tags: ["smoked"],
  }),
  menuItem("Beef chilli with garlic rice", 1820, {
    description: "Wok fried beef in Asian-style sauce",
    tags: ["spicy"],
  }),
  menuItem("Hot notch half chicken", 1710, {
    description: "Buttermilk-brined fried chicken in Nashville-style butter sauce",
    tags: ["spicy"],
  }),
  menuItem("Smoked chicken breast", 1710, {
    tags: ["smoked"],
    choiceGroups: [
      sauceGroup([
        "Habanero hell fire",
        "Mushroom and spinach",
        "Pineapple salsa",
      ]),
    ],
  }),
  menuItem("Stone grilled chicken", 1750, {
    variants: variants("Stone grilled chicken", [
      ["Half", 1750],
      ["Full", 3300],
    ]),
    choiceGroups: [sauceGroup(["Habanero hell fire", "Cream and herbs"])],
  }),
  menuItem("Parmesan crusted chicken", 1810, {
    description: "With Mexican creamy and spicy sauce",
    tags: ["spicy"],
  }),
  menuItem("Garlic parmesan grilled chicken", 1720),
  menuItem("Tarragon chicken", 1610, {
    description: "Chicken breast in creamy tarragon sauce",
  }),
  menuItem("Tuscan mushroom chicken with garlic rice", 1610, {
    description: "Garlic parmesan sauce, sundried tomatoes, spinach",
  }),
  menuItem("Korean sweet chilli rice bowl", 1610, {
    description:
      "Crispy chicken, Korean chilli glaze, steamed rice, pickles, dynamite sauce",
    tags: ["spicy"],
  }),
  menuItem("Coconut and lime baked fish with garlic rice", 2610),
  menuItem("Smoked red snapper", 2710, {
    description: "Creamy lemon butter herb sauce",
    tags: ["smoked"],
  }),
  menuItem("Butterflied jumbo prawns", 3440, {
    description: "Smoked tiger prawns, creamy herb lemon butter sauce",
    tags: ["smoked"],
  }),
]);
