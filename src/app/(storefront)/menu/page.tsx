import type { Metadata } from "next";
import { LazyMenuSection } from "@/components/menu/lazy-menu-section";
import { MenuPageClient } from "@/components/menu/menu-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { site } from "@/data/site";
import { getRuntimeMenu } from "@/lib/menu-runtime";
import { buildPageMetadata, menuJsonLd, SITE_TITLE } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_TITLE,
  description:
    "Browse Markhor Smoked Meat starters, steaks, tacos, burgers, pasta and more in DHA Phase 6, Karachi.",
  path: "/menu",
  absoluteTitle: true,
});

export default async function MenuPage() {
  const runtimeMenu = await getRuntimeMenu();

  return (
    <main className="paper-texture bg-cream">
      <JsonLd data={menuJsonLd()} />
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-8 pb-2">
        <SectionEyebrow>The menu</SectionEyebrow>
        <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Full board
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">{site.footer.note}</p>
      </div>
      <MenuPageClient categories={runtimeMenu}>
        <div className="flex flex-col gap-12">
          {runtimeMenu.map((category, index) => (
            <LazyMenuSection
              key={category.id}
              category={category}
              eager={index < 2}
            />
          ))}
        </div>
      </MenuPageClient>
    </main>
  );
}
