/**
 * Dark-style Pexels/Unsplash search queries per menu slug.
 * Primary → dark fallback → category fallback.
 */

export type ImageQuerySet = {
  primary: string;
  dark: string;
  category: string;
};

const DARK = "dark background moody food photography";
const DARK_SHORT = "dark moody";

function q(specific: string, category: string): ImageQuerySet {
  return {
    primary: `${specific} ${DARK}`,
    dark: `${specific} dark`,
    category: `${category} ${DARK_SHORT}`,
  };
}

/** Slugs allowed to share the same stock photo ID. */
export const SHARED_IMAGE_GROUPS: Record<string, readonly string[]> = {
  sauces: [
    "habanero-hell-fire",
    "eastern-carolina-bbq-sauce",
    "hot-salsa",
    "pineapple-salsa",
    "creamy-mustard",
    "sriracha-mayo",
    "honey-mustard",
    "classic-peppercorn-steak-sauce",
    "creamy-mushroom-steak-sauce",
  ],
  water: ["water", "sparkling-water"],
  soft_detox: ["soft-drink", "detox"],
  tea: ["tea", "green-tea"],
  sides_share: ["coleslaw", "rye-bread-slices"],
};

export const CATEGORY_FALLBACK_QUERY: Record<string, string> = {
  starters: `appetizer fries nachos wings ${DARK_SHORT}`,
  soups: `soup bowl dark food ${DARK_SHORT}`,
  tacos: `tacos dark plate ${DARK_SHORT}`,
  "fresh-salads": `salad dark bowl ${DARK_SHORT}`,
  "beef-chicken-and-seafood-mains": `steak grilled meat dark ${DARK_SHORT}`,
  pastas: `pasta dark plate ${DARK_SHORT}`,
  "burgers-and-sandwiches": `burger sandwich dark ${DARK_SHORT}`,
  "meat-only": `smoked brisket sliced dark ${DARK_SHORT}`,
  "complements-sides": `side dish dark plate ${DARK_SHORT}`,
  sauces: `sauce dip bowl dark ${DARK_SHORT}`,
  "kids-menu": `chicken nuggets fries dark ${DARK_SHORT}`,
  desserts: `dessert dark plate ${DARK_SHORT}`,
  "cold-beverages": `cocktail drink glass dark ${DARK_SHORT}`,
  "hot-beverages": `tea cup dark ${DARK_SHORT}`,
};

export const imageQueries: Record<string, ImageQuerySet> = {
  // Starters
  "brisket-and-cream-cheese-stuffed-texas-twinkies": q(
    "jalapeno poppers cream cheese bacon",
    "appetizer",
  ),
  "steak-fries-with-cheese": q("steak fries cheese loaded", "fries"),
  "parmesan-truffle-fries": q("truffle parmesan fries", "fries"),
  "brisket-loaded-fries": q("brisket loaded fries cheese", "fries"),
  "loaded-baked-potato-with-brisket-and-cheese": q(
    "loaded baked potato cheese meat",
    "potato",
  ),
  "wings-on-fire": q("spicy chicken wings hot sauce", "wings"),
  "chicken-tenders": q("chicken tenders crispy", "fried chicken"),
  "pastrami-cheese-toasties": q("pastrami grilled cheese toast", "sandwich"),
  "kansas-city-brisket-nachos": q("brisket nachos cheese", "nachos"),
  "nashville-hot-chicken-tenders": q("nashville hot chicken tenders", "fried chicken"),
  "dynamite-chicken-fries": q("dynamite chicken fries spicy", "fries"),
  "nashville-chicken-fries": q("nashville hot chicken fries", "fries"),
  "dynamite-chicken-tenders": q("spicy chicken tenders sauce", "fried chicken"),
  "dynamite-prawns": q("dynamite shrimp prawns spicy", "shrimp"),
  "french-fries": q("french fries dark plate", "fries"),
  "cheesy-garlic-bread": q("cheesy garlic bread", "bread"),

  // Soups
  "cream-of-mushroom-soup": q("cream of mushroom soup bowl", "soup"),
  "caveman-beef-broth": q("beef bone broth bowl dark", "soup"),
  "fishermans-stew": q("fisherman seafood stew bowl", "soup"),
  "seafood-chowder": q("seafood chowder bowl", "soup"),

  // Tacos
  "birria-tacos": q("birria tacos consomme", "tacos"),
  "smoked-brisket-tacos": q("brisket tacos smoked", "tacos"),
  "caesar-tacos": q("chicken caesar tacos", "tacos"),
  "smoked-chicken-tacos": q("smoked chicken tacos", "tacos"),
  "spicy-shrimp-taco": q("spicy shrimp taco", "tacos"),
  "smashed-beef-taco": q("smashed beef taco cheese", "tacos"),

  // Salads
  "smoked-chicken-salad": q("smoked chicken salad bowl", "salad"),
  "caesar-salad": q("caesar salad dark bowl", "salad"),
  "smoked-pastrami-salad": q("pastrami salad bowl", "salad"),
  "fresh-green-salad": q("fresh green salad dark", "salad"),

  // Mains
  "filet-mignon": q("filet mignon steak dark plate", "steak"),
  "beef-tenderloin-steak": q("beef tenderloin steak", "steak"),
  "wild-buffalo-tenderloin-steak": q("buffalo tenderloin steak", "steak"),
  "steak-and-eggs": q("steak and eggs breakfast plate", "steak"),
  "angus-ribeye-grass-fed-aus": q("angus ribeye steak grilled", "steak"),
  "beef-brisket": q("smoked beef brisket sliced", "brisket"),
  "beef-ribs": q("smoked beef ribs bbq", "ribs"),
  "beef-chilli-with-garlic-rice": q("beef chili garlic rice bowl", "chili"),
  "hot-notch-half-chicken": q("half roast chicken dark plate", "chicken"),
  "smoked-chicken-breast": q("smoked chicken breast sliced", "chicken"),
  "stone-grilled-chicken": q("grilled chicken stone plate", "chicken"),
  "parmesan-crusted-chicken": q("parmesan crusted chicken", "chicken"),
  "garlic-parmesan-grilled-chicken": q(
    "garlic parmesan grilled chicken",
    "chicken",
  ),
  "tarragon-chicken": q("tarragon chicken plate", "chicken"),
  "tuscan-mushroom-chicken-with-garlic-rice": q(
    "tuscan mushroom chicken rice",
    "chicken",
  ),
  "korean-sweet-chilli-rice-bowl": q("korean sweet chili rice bowl", "rice bowl"),
  "coconut-and-lime-baked-fish-with-garlic-rice": q(
    "coconut lime baked fish rice",
    "fish",
  ),
  "smoked-red-snapper": q("smoked red snapper fish", "fish"),
  "butterflied-jumbo-prawns": q("butterflied jumbo prawns grilled", "prawns"),

  // Pastas
  "wild-mushroom-truffle-pasta": q("mushroom truffle pasta dark", "pasta"),
  "birria-ramen": q("birria ramen bowl", "ramen"),
  "grilled-cheese-rigatoni": q("cheesy rigatoni pasta baked", "pasta"),
  "creamy-bolognese": q("creamy bolognese pasta", "pasta"),
  "classic-beef-lasagna": q("beef lasagna layered", "lasagna"),
  "classic-mac-and-cheese": q("mac and cheese baked", "pasta"),
  "creamy-tomato-rigatoni": q("creamy tomato rigatoni", "pasta"),
  "seafood-linguine": q("seafood linguine pasta", "pasta"),
  "fettuccine-with-smoked-chicken": q("fettuccine smoked chicken", "pasta"),
  "yaki-udon": q("yaki udon noodles", "noodles"),

  // Burgers & sandwiches
  "midwest-smoked-pulled-beef-burger": q(
    "pulled beef burger smoked",
    "burger",
  ),
  "brisket-burger-highway-man-style": q("brisket burger stacked", "burger"),
  "beef-ribs-and-mac-burger": q("ribs mac cheese burger", "burger"),
  "the-beast": q("giant stacked beef burger", "burger"),
  "philly-cheesesteak-burger": q("philly cheesesteak sandwich", "sandwich"),
  "the-holy-chuck": q("thick chuck beef burger", "burger"),
  "beef-mushroom-melt": q("beef mushroom melt sandwich", "sandwich"),
  "classic-texas-style-smoked-beef-burger": q(
    "texas smoked beef burger",
    "burger",
  ),
  "pastrami-on-rye": q("pastrami sandwich rye", "sandwich"),
  "croissant-lineup": q("savory croissant sandwich", "croissant"),
  "korean-chicken-burger": q("korean fried chicken burger", "burger"),
  "nashville-chicken-burger": q("nashville hot chicken burger", "burger"),
  "crispy-chicken-burger": q("crispy chicken burger", "burger"),
  "chicken-fillet-burger": q("chicken fillet burger", "burger"),
  "pitboss-chickwich-club": q("chicken club sandwich", "sandwich"),
  "smoked-chicken-and-corn-beef-pepper-jack": q(
    "smoked chicken corned beef sandwich",
    "sandwich",
  ),

  // Meat only
  "brisket-500g": q("smoked brisket 500g sliced dark", "brisket"),
  "pastrami-500g": q("pastrami sliced dark board", "pastrami"),

  // Sides
  "butter-garlic-mash": q("butter garlic mashed potatoes", "side"),
  "parmesan-roasted-potato-wedges": q(
    "parmesan roasted potato wedges",
    "potato",
  ),
  "smoked-bbq-beans": q("smoked bbq baked beans bowl", "beans"),
  "seasoned-corn": q("seasoned grilled corn", "corn"),
  "smoky-roasted-garlic-rice": q("garlic rice bowl dark", "rice"),
  coleslaw: q("coleslaw side bowl", "salad"),
  "rye-bread-slices": q("rye bread slices dark", "bread"),

  // Sauces
  "habanero-hell-fire": q("habanero hot sauce bowl dark", "sauce"),
  "eastern-carolina-bbq-sauce": q("carolina bbq sauce bowl", "sauce"),
  "hot-salsa": q("hot salsa bowl dark", "sauce"),
  "pineapple-salsa": q("pineapple salsa bowl", "sauce"),
  "creamy-mustard": q("creamy mustard dip bowl", "sauce"),
  "sriracha-mayo": q("sriracha mayo dip bowl", "sauce"),
  "honey-mustard": q("honey mustard dip bowl", "sauce"),
  "classic-peppercorn-steak-sauce": q("peppercorn steak sauce", "sauce"),
  "creamy-mushroom-steak-sauce": q("mushroom steak sauce bowl", "sauce"),

  // Kids
  "nuggets-with-french-fries": q("chicken nuggets french fries", "kids meal"),
  "chicken-pops-with-french-fries": q(
    "chicken popcorn bites fries",
    "kids meal",
  ),

  // Desserts
  "burnt-vanilla-creme-brulee": q("creme brulee", "dessert"),
  "island-coconut-ice-cream": q("coconut ice cream scoop", "dessert"),
  "mango-bliss-ice-cream": q("mango ice cream scoop", "dessert"),
  "markhor-molten-chocolate-cake": q("molten chocolate lava cake", "dessert"),

  // Cold beverages
  "caramel-cinnamon-mojito": q("caramel cinnamon mojito glass", "cocktail"),
  "mango-and-dragon-fruit-cooler": q(
    "mango dragon fruit cooler glass",
    "drink",
  ),
  "coke-float": q("coke float ice cream glass", "drink"),
  "lychee-rose-spritz": q("lychee rose spritz glass", "cocktail"),
  "long-island-peach-iced-tea": q("peach iced tea tall glass", "drink"),
  "strawberry-lemonade": q("strawberry lemonade glass", "drink"),
  "virgin-pina-colada": q("virgin pina colada glass", "drink"),
  "mint-lemonade": q("mint lemonade glass", "drink"),
  "thirst-burst": q("colorful fruit cooler glass", "drink"),
  "red-bull": q("energy drink can dark", "drink"),
  "red-bull-mocktail": q("energy drink mocktail glass", "cocktail"),
  "sparkling-water": q("sparkling water glass bubbles dark", "drink"),
  detox: q("detox green juice glass dark", "drink"),
  water: q("still water glass dark", "drink"),
  "soft-drink": q("soft drink glass ice dark", "drink"),

  // Hot beverages
  "green-tea": q("green tea cup dark", "tea"),
  tea: q("black tea cup dark steam", "tea"),
};

export function sharedGroupForSlug(slug: string): string | null {
  for (const [group, slugs] of Object.entries(SHARED_IMAGE_GROUPS)) {
    if (slugs.includes(slug)) return group;
  }
  return null;
}
