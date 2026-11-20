import { MenuImage } from "@/components/menu/menu-image";
import { MenuItemAdd } from "@/components/menu/menu-item-add";
import type { MenuItem } from "@/data/menu-types";
import type { RuntimeMenuItem } from "@/lib/menu-runtime";
import { cn } from "@/lib/cn";
import { formatItemPrice } from "@/lib/menu";

export function MenuItemCard({ item }: { item: MenuItem | RuntimeMenuItem }) {
  const soldOut = !item.available;
  const imageSrc = "imageSrc" in item ? item.imageSrc : null;
  const imageSquareSrc =
    "imageSquareSrc" in item ? item.imageSquareSrc : null;
  const imageThumbSrc = "imageThumbSrc" in item ? item.imageThumbSrc : null;

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
          itemId={item.id}
          imageSrc={imageSrc}
          imageSquareSrc={imageSquareSrc}
          imageThumbSrc={imageThumbSrc}
          rounded="rounded-none"
          className="aspect-[5/3]"
        />
        {soldOut ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-on-brand">
            Not available
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
