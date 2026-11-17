import type { Category, MenuItem } from "@/data/menu-types";
import { MenuRow } from "@/components/menu/menu-row";
import { cn } from "@/lib/cn";

type MenuSectionProps = {
  id: string;
  name: string;
  items: MenuItem[];
  hint?: string;
  className?: string;
};

export function MenuSection({
  id,
  name,
  items,
  hint = "Rs., excl. GST",
  className,
}: MenuSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-[calc(var(--header-h)+var(--chips-h,3.5rem)+0.75rem)]",
        className,
      )}
    >
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-line pb-2">
        <h2
          id={`${id}-title`}
          className="font-eyebrow text-xs font-semibold text-ink uppercase"
        >
          {name}
        </h2>
        <p className="text-[11px] tracking-wide text-muted uppercase">{hint}</p>
      </div>
      <ul className="grid gap-1 lg:grid-cols-2 lg:gap-x-8">
        {items.map((item) => (
          <li key={item.id}>
            <MenuRow item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MenuSectionFromCategory({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <MenuSection
      id={category.id}
      name={category.name}
      items={category.items}
      className={className}
    />
  );
}
