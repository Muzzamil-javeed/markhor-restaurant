import { TransitionLink } from "@/components/transition/TransitionLink";
import { HomeSection } from "@/components/home/section";
import { menu } from "@/data/menu";

export function HomeBrowseMenu() {
  return (
    <HomeSection
      id="browse-menu"
      eyebrow="Menu"
      title="Browse the menu"
      description="Fourteen categories, from starters to hot drinks."
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {menu.map((category) => (
          <li key={category.id}>
            <TransitionLink
              href={`/menu#${category.id}`}
              className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm transition-colors hover:border-brand/30 hover:bg-tint/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <span className="font-heading text-sm font-semibold text-ink sm:text-base">
                {category.name}
              </span>
              <span className="text-xs text-muted sm:text-sm">
                {category.items.length}{" "}
                {category.items.length === 1 ? "item" : "items"}
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}

