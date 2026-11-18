import Image from "next/image";
import { notFound } from "next/navigation";
import { menu } from "@/data/menu";
import { getItemImage } from "@/data/images";

export const dynamic = "force-static";

/** Dev-only contact sheet of all 116 dish photos. */
export default function ImageAuditPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-[#1A1112] px-4 py-10 text-cream">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-display text-3xl uppercase tracking-tight">
          Image audit
        </h1>
        <p className="mt-2 text-sm text-cream/60">
          All {menu.reduce((n, c) => n + c.items.length, 0)} dishes — stock /
          fallback preview. Dev only.
        </p>

        <div className="mt-8 space-y-10">
          {menu.map((category) => (
            <section key={category.id}>
              <h2 className="font-eyebrow text-[10px] tracking-[0.18em] text-[#e87830] uppercase">
                {category.name}
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {category.items.map((item) => {
                  const image = getItemImage({
                    slug: item.slug,
                    name: item.name,
                    hasStockWebp: true,
                  });
                  return (
                    <li
                      key={item.id}
                      className="overflow-hidden rounded-xl ring-1 ring-inset ring-[rgba(246,244,242,0.08)]"
                    >
                      <div className="relative aspect-[16/10] bg-[#140D0E]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5 bg-[#140D0E] px-2 py-2">
                        <p className="truncate text-xs font-medium text-cream">
                          {item.name}
                        </p>
                        <p className="truncate font-mono text-[10px] text-cream/40">
                          {item.slug} · {image.source}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
