import { category, menuItem, variants } from "@/data/menu-build";

export const pastas = category("Pastas", [
  menuItem("Wild mushroom truffle pasta", 1560),
  menuItem("Birria ramen", 1710, {
    description: "Slow-braised beef birria, ramen noodles, consomme",
  }),
  menuItem("Grilled cheese rigatoni", 1610, {
    description:
      "Garlic-parmesan sauce, mushrooms, capsicum, olives, mozzarella and cheddar, baked",
  }),
  menuItem("Creamy bolognese", 1540),
  menuItem("Classic beef lasagna", 1810),
  menuItem("Classic mac and cheese", 1610, {
    variants: variants("Classic mac and cheese", [
      ["Brisket burnt ends", 1610],
      ["Nashville chicken", 1670],
    ]),
  }),
  menuItem("Creamy tomato rigatoni", 1540, {
    description: "Tomato cream sauce, basil, parmesan, fried chicken cutlet",
  }),
  menuItem("Seafood linguine", 1710, {
    description: "Prawns, mussels, squid, garlic chilli, tomatoes",
  }),
  menuItem("Fettuccine with smoked chicken", 1610, { tags: ["smoked"] }),
  menuItem("Yaki udon", 1510, {
    description: "Stir-fried udon in soy-based sauce",
    variants: variants("Yaki udon", [
      ["Chicken", 1510],
      ["Beef", 1570],
      ["Prawn", 1610],
    ]),
  }),
]);
