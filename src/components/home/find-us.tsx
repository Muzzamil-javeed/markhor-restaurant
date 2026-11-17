"use client";

import { useSyncExternalStore } from "react";
import {
  Clock3,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { BrandLink } from "@/components/ui/brand-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { site } from "@/data/site";
import { getKarachiParts } from "@/lib/hours";
import { displayPhone, telHref } from "@/lib/phone";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(id);
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: string;
}) {
  return (
    <h3 className="font-eyebrow flex items-center gap-2 text-[11px] font-semibold text-brand uppercase">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-brand/20 bg-tint text-brand">
        <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      </span>
      {children}
    </h3>
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
    <section className="paper-texture bg-cream">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-16 lg:py-20">
        <Reveal>
          <SectionEyebrow>Check before you come</SectionEyebrow>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Come hungry. We&apos;ll handle the rest.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
          <Reveal>
            <SectionTitle icon={MapPin}>Find us</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {site.address}
            </p>
            <a
              href={site.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Navigation className="size-3.5" aria-hidden />
              Get directions
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            <SectionTitle icon={Clock3}>Hours</SectionTitle>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm">
              {site.hours.map((block) => {
                const today =
                  dayIndex >= 0 && block.dayIndexes.includes(dayIndex);
                return (
                  <li
                    key={block.id}
                    className="rounded-xl bg-tint px-3 py-2.5 text-ink"
                  >
                    <span className="inline-flex flex-wrap items-center gap-2 font-semibold">
                      <Clock3
                        className="size-3.5 shrink-0 text-brand/70"
                        aria-hidden
                      />
                      {block.days}
                      {today ? (
                        <span className="text-[10px] font-semibold tracking-wide text-brand uppercase">
                          Today
                        </span>
                      ) : null}
                    </span>
                    <p className="mt-1 pl-5 text-muted">{block.label}</p>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <SectionTitle icon={Phone}>Call or order</SectionTitle>
            <div className="mt-3 flex flex-col gap-4">
              <a
                href={telHref()}
                className="block break-all font-heading text-lg font-semibold tracking-tight text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:break-normal"
              >
                {phone}
              </a>
              <BrandLink
                href="/menu"
                className="inline-flex w-fit items-center gap-2"
              >
                <ShoppingBag className="size-4" aria-hidden />
                Order online
              </BrandLink>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-tint px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <InstagramIcon className="size-3.5" />
                  Instagram
                </a>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-tint px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <FacebookIcon className="size-3.5" />
                  Facebook
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
