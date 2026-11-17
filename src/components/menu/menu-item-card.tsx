import { MenuImage } from "@/components/menu/menu-image";
import { MenuItemAdd } from "@/components/menu/menu-item-add";
import type { MenuItem } from "@/data/menu-types";
import type { RuntimeMenuItem } from "@/lib/menu-runtime";
import { cn } from "@/lib/cn";
import { formatItemPrice } from "@/lib/menu";

export function MenuItemCard({ item }: { item: MenuItem | RuntimeMenuItem }) {
  const soldOut = !item.available;
  const imageSrc = "imageSrc" in item ? item.imageSrc : null;

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm",
        soldOut && "opacity-60",
      )}
    >
      <div className="relative">
        <MenuImage
          name={item.name}
          slug={item.slug}
          imageSrc={imageSrc}
          rounded="rounded-none"
          className="aspect-[5/3]"
        />
        {soldOut ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-on-brand">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-base font-semibold text-ink">{item.name}</h3>
          {item.description ? (
            <p className="line-clamp-2 text-sm text-muted">{item.description}</p>
          ) : null}
          <p className="mt-1 text-sm font-medium text-ink">
            {formatItemPrice(item)}
          </p>
        </div>

        <MenuItemAdd item={item} />
      </div>
    </article>
  );
}
