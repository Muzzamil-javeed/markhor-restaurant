import { Clock3, MapPin, Flame } from "lucide-react";
import { HeroCopy } from "@/components/home/hero-copy";
import { HeroSlider } from "@/components/home/hero-slider";
import { HeroSmoke } from "@/components/home/hero-smoke";
import { HeroStatusCard } from "@/components/home/hero-status";
import { PageEntrance } from "@/components/transition/PageEntrance";
import { BrandLink } from "@/components/ui/brand-button";
import { displayPhone, telHref } from "@/lib/phone";

export function HomeHero() {
  const phone = displayPhone();

  return (
    <section className="relative isolate -mt-[var(--header-h,4.5rem)] flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#140D0E] text-cream">
      <div className="absolute inset-0 overflow-hidden bg-[#140D0E]" aria-hidden>
        <HeroSlider />
        <HeroSmoke />
      </div>

      <div className="relative z-[3] flex flex-1 items-center justify-center px-[clamp(1rem,4vw,3rem)] pt-[calc(var(--header-h,4.5rem)+1rem)] pb-8">
        <HeroCopy />
      </div>

      <div className="relative z-[3] mx-auto w-full max-w-[min(100%,1600px)] px-[clamp(1rem,4vw,3rem)] pb-[clamp(1.75rem,4vh,3rem)]">
        <PageEntrance
          delay={0.35}
          className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="flex flex-col items-center gap-5 lg:items-start">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs tracking-wide text-cream/75 uppercase lg:justify-start">
              <li className="inline-flex items-center gap-1.5">
                <Flame className="size-3.5 text-[#e87830]" aria-hidden />
                Smoked brisket
              </li>
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                DHA Phase 6
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" aria-hidden />
                Open daily from 12:30 PM
              </li>
            </ul>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <BrandLink href="/menu" transitionLabel="Menu" variant="solidLight">
                Order now
              </BrandLink>
              <a
                href={telHref()}
                className="inline-flex h-12 items-center justify-center rounded-full border border-cream/70 px-6 text-sm font-semibold text-cream transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50"
              >
                Call {phone}
              </a>
            </div>
          </div>

          <HeroStatusCard />
        </PageEntrance>
      </div>
    </section>
  );
}
