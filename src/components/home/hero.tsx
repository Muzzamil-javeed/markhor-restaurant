"use client";

import { Clock3, MapPin, Flame } from "lucide-react";
import { HeroAtmosphere } from "@/components/home/hero-atmosphere";
import { HeroCopy } from "@/components/home/hero-copy";
import { HeroGsap } from "@/components/home/hero-gsap";
import { HeroMagneticCta } from "@/components/home/hero-magnetic-cta";
import { HeroMedia } from "@/components/home/hero-media";
import { HeroScrollCue } from "@/components/home/hero-scroll-cue";
import { HeroStatusCard } from "@/components/home/hero-status";
import { BrandLink } from "@/components/ui/brand-button";
import { displayPhone, telHref } from "@/lib/phone";

export function HomeHero() {
  const phone = displayPhone();

  return (
    <HeroGsap>
      <div
        data-hero-media
        className="absolute inset-0 overflow-hidden bg-[#140D0E] will-change-transform"
        aria-hidden
      >
        <HeroMedia />
        <HeroAtmosphere />
      </div>

      <div className="relative z-[3] flex flex-1 items-center justify-center px-[clamp(1rem,4vw,3rem)] pt-[calc(var(--header-h,4.5rem)+1rem)] pb-8">
        <HeroCopy />
      </div>

      <div
        className="relative z-[3] mx-auto w-full max-w-[min(100%,1600px)] px-[clamp(1rem,4vw,3rem)] pb-[clamp(2.5rem,5vh,3.75rem)]"
        data-hero-fade
      >
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col items-center gap-5 lg:items-start">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs tracking-wide text-cream/75 uppercase lg:justify-start">
              <li data-hero-chip className="inline-flex items-center gap-1.5">
                <Flame className="size-3.5 text-[#e87830]" aria-hidden />
                Smoked brisket
              </li>
              <li data-hero-chip className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                DHA Phase 6
              </li>
              <li data-hero-chip className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" aria-hidden />
                Open daily from 12:30 PM
              </li>
            </ul>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <HeroMagneticCta>
                <BrandLink
                  href="/menu"
                  transitionLabel="Menu"
                  variant="solidLight"
                  className="hero-cta-glow shadow-[0_0_0_0_rgba(232,120,48,0)]"
                >
                  Order now
                </BrandLink>
              </HeroMagneticCta>
              <HeroMagneticCta strength={0.22}>
                <a
                  href={telHref()}
                  className="hero-call-ring inline-flex h-12 items-center justify-center rounded-full border border-cream/70 px-6 text-sm font-semibold text-cream transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50"
                >
                  Call {phone}
                </a>
              </HeroMagneticCta>
            </div>
          </div>

          <div data-hero-status>
            <HeroStatusCard />
          </div>
        </div>
      </div>

      <div data-hero-cue>
        <HeroScrollCue />
      </div>
    </HeroGsap>
  );
}
