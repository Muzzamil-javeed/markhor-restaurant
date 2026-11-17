import { LazyCategorySection } from "@/components/menu/lazy-category-section";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { Category } from "@/data/menu-types";

export function MenuCatalog({
  categories,
  eagerCount = 1,
}: {
  categories: Category[];
  eagerCount?: number;
}) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-ink">No dishes match</p>
        <p className="mt-2 text-sm text-muted">
          Try another search or clear the Spicy, Smoked, or Under Rs. 1,000
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {categories.map((category, index) => (
        <LazyCategorySection
          key={category.id}
          id={category.id}
          titleId={`${category.id}-title`}
          name={category.name}
          itemCount={category.items.length}
          eager={index < eagerCount}
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => (
              <li key={item.id}>
                <MenuItemCard item={item} />
              </li>
            ))}
          </ul>
        </LazyCategorySection>
      ))}
    </div>
  );
}
