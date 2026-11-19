"use client";

import {
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  Clock3,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
  type LucideProps,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLink } from "@/components/ui/brand-button";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/ui/brand-social-icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { getKarachiParts } from "@/lib/hours";
import { displayPhone, telHref } from "@/lib/phone";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(id);
}

function InfoCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: ComponentType<LucideProps>;
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <Reveal delay={delay}>
      <motion.article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl",
          "border border-brand/25 bg-white/80 backdrop-blur-sm",
          "shadow-[0_14px_36px_rgba(94,15,29,0.1),0_0_0_1px_rgba(94,15,29,0.06)]",
          "transition-[border-color,box-shadow] duration-300",
          "hover:border-brand/50 hover:shadow-[0_20px_44px_rgba(94,15,29,0.18)]",
        )}
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent"
          aria-hidden
        />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-eyebrow flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-tint text-brand shadow-[0_6px_16px_rgba(94,15,29,0.12)] transition-transform duration-300 group-hover:scale-105">
              <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
            </span>
            {title}
          </h3>
          <div className="mt-4 flex flex-1 flex-col">{children}</div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function HomeFindUs() {
  const phone = displayPhone();
  const dayIndex = useSyncExternalStore(
    subscribe,
    () => getKarachiParts(new Date()).dayIndex,
    () => -1,
  );

  return (
    <section className="relative overflow-hidden paper-texture bg-cream">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 12% 0%, rgba(94,15,29,0.08), transparent 48%), radial-gradient(ellipse at 92% 100%, rgba(94,15,29,0.05), transparent 42%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 py-16 lg:py-20">
        <Reveal>
          <SectionEyebrow>Check before you come</SectionEyebrow>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Come hungry. We&apos;ll handle the rest.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            DHA Phase 6 smokehouse — hours, directions, and a direct line when
            you&apos;re ready to order.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          <InfoCard icon={MapPin} title="Find us">
            <p className="text-sm leading-relaxed text-ink/85">{site.address}</p>
            <a
              href={site.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand/20 bg-tint px-3.5 py-2 text-sm font-semibold text-brand transition-all duration-300 hover:border-brand/40 hover:bg-brand hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Navigation className="size-3.5" aria-hidden />
              Get directions
            </a>
          </InfoCard>

          <InfoCard icon={Clock3} title="Hours" delay={0.06}>
            <ul className="flex flex-col gap-2.5 text-sm">
              {site.hours.map((block) => {
                const today =
                  dayIndex >= 0 && block.dayIndexes.includes(dayIndex);
                return (
                  <li
                    key={block.id}
                    className={cn(
                      "rounded-xl border px-3.5 py-3 transition-colors duration-300",
                      today
                        ? "border-brand/35 bg-tint shadow-[0_8px_20px_rgba(94,15,29,0.08)]"
                        : "border-line/80 bg-[#FBF9F8]",
                    )}
                  >
                    <span className="inline-flex flex-wrap items-center gap-2 font-semibold text-ink">
                      <Clock3
                        className="size-3.5 shrink-0 text-brand/70"
                        aria-hidden
                      />
                      {block.days}
                      {today ? (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-on-brand uppercase">
                          Today
                        </span>
                      ) : null}
                    </span>
                    <p className="mt-1.5 pl-5 text-muted">{block.label}</p>
                  </li>
                );
              })}
            </ul>
          </InfoCard>

          <InfoCard icon={Phone} title="Call or order" delay={0.12}>
            <a
              href={telHref()}
              className="block break-all font-heading text-xl font-semibold tracking-tight text-ink transition-colors duration-300 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:break-normal"
            >
              {phone}
            </a>
            <BrandLink
              href="/menu"
              className="mt-4 inline-flex w-fit items-center gap-2 shadow-[0_12px_28px_rgba(94,15,29,0.28)] transition-transform duration-300 hover:scale-[1.02]"
            >
              <ShoppingBag className="size-4" aria-hidden />
              Order online
            </BrandLink>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm transition-transform duration-300 hover:scale-[1.03] hover:border-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <InstagramIcon className="size-[1.05rem]" />
                Instagram
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm transition-transform duration-300 hover:scale-[1.03] hover:border-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <FacebookIcon className="size-[1.05rem]" />
                Facebook
              </a>
            </div>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}
