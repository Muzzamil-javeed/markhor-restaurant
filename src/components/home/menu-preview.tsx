import Image from "next/image";
import { MenuSection } from "@/components/menu/menu-section";
import { BrandLink } from "@/components/ui/brand-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { homeMenuPreview } from "@/data/home-preview";
import { site } from "@/data/site";

export function HomeMenuPreview() {
  return (
    <section className="paper-texture bg-tan">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-16 lg:py-20">
        <Reveal>
          <SectionEyebrow>The menu</SectionEyebrow>
          <h2 className="font-display mt-3 max-w-2xl text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Smoked, grilled, served right.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-10 lg:col-span-2">
            {homeMenuPreview.map((group, index) => (
              <Reveal key={group.id} delay={index * 0.04}>
                <MenuSection
                  id={`preview-${group.id}`}
                  name={group.name}
                  items={[...group.items]}
                />
              </Reveal>
            ))}
            <p className="text-xs text-muted">{site.footer.note}</p>
            <BrandLink href="/menu" className="w-fit">
              See full menu and order
            </BrandLink>
          </div>

          <div className="relative hidden min-h-[28rem] lg:block">
            <div className="absolute top-4 right-2 w-[85%] -rotate-2 overflow-hidden rounded-xl border border-line bg-white p-2 shadow-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink">
                <Image
                  src="/images/home/menu-preview.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>
            <div className="absolute right-8 bottom-6 w-[78%] rotate-2 overflow-hidden rounded-xl border border-line bg-white p-2 shadow-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink">
                <Image
                  src="/images/home/sides-dark.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="260px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
