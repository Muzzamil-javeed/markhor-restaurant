import Image from "next/image";
import { MenuSection } from "@/components/menu/menu-section";
import { BrandLink } from "@/components/ui/brand-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { homeMenuPreview } from "@/data/home-preview";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

const PREVIEW_FRAMES = [
  {
    src: "/images/home/menu-preview.jpg",
    alt: "Smokehouse grill",
    tilt: "-rotate-2",
    width: "w-[88%] self-end",
  },
  {
    src: "/images/home/how-it-works.jpg",
    alt: "Plated smoked meat",
    tilt: "rotate-[1.5deg]",
    width: "w-[82%] self-start",
  },
  {
    src: "/images/home/sides-dark.png",
    alt: "Smokehouse sides",
    tilt: "rotate-2",
    width: "w-[86%] self-end",
  },
] as const;

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

          <div className="relative hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-8">
              {PREVIEW_FRAMES.map((frame) => (
                <div
                  key={frame.src}
                  className={cn(
                    "overflow-hidden rounded-xl border border-line bg-white p-2 shadow-sm",
                    frame.tilt,
                    frame.width,
                  )}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-transparent">
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      className="object-cover object-center"
                      sizes="280px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
