"use client";

import { useState, type ComponentType } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dices,
  Star,
  type LucideProps,
} from "lucide-react";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
} from "@/components/ui/brand-social-icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

const PERK_ICONS: Record<string, ComponentType<LucideProps>> = {
  "complimentary-tea": Coffee,
  "uno-or-jenga": Dices,
};

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: site.instagram,
    Icon: InstagramIcon,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: site.facebook,
    Icon: FacebookIcon,
  },
  {
    id: "google",
    label: "Google reviews",
    href: site.reviewsUrl,
    Icon: GoogleIcon,
  },
] as const;

export function HomeTableAndReviews() {
  const [index, setIndex] = useState(0);
  const review = site.reviews[index]!;

  return (
    <section className="relative overflow-hidden paper-texture bg-tan">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(94,15,29,0.07),transparent_48%),radial-gradient(ellipse_at_90%_80%,rgba(66,133,244,0.05),transparent_42%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1100px] gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <Reveal>
          <SectionEyebrow>At the table</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Little extras, big mood.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Share the smokehouse, sip tea, play a round — then find us on social
            and Google.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="Social links">
            {SOCIALS.map(({ id, label, href, Icon }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm transition-transform hover:scale-[1.03] hover:border-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <Icon className="size-[1.15rem]" />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-col gap-4">
            {site.perks.map((perk) => {
              const isInsta = perk.id === "insta-story";
              const Icon = PERK_ICONS[perk.id] ?? Coffee;
              return (
                <li
                  key={perk.id}
                  className="group flex gap-3.5 rounded-2xl border border-dashed border-brand/35 bg-cream/80 px-4 py-4 shadow-[0_8px_24px_rgba(36,26,27,0.04)] transition-colors duration-300 hover:border-brand/55 hover:bg-cream"
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(94,15,29,0.08)] transition-transform duration-300 group-hover:scale-105",
                      isInsta ? "bg-white" : "bg-tint text-brand",
                    )}
                  >
                    {isInsta ? (
                      <InstagramIcon className="size-5" />
                    ) : (
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-eyebrow text-[10px] font-semibold text-brand uppercase">
                      {isInsta ? "Instagram" : "Stamp"}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-ink">
                      {isInsta ? (
                        <a
                          href={site.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                        >
                          {perk.title}
                        </a>
                      ) : (
                        perk.title
                      )}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {perk.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.06}>
          <SectionEyebrow>Guests say</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Straight from Google.
          </h2>

          <figure className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-[0_14px_40px_rgba(36,26,27,0.07)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div
                className="flex gap-1 text-[#FBBC05]"
                role="img"
                aria-label="5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-[#FBBC05] text-[#FBBC05]"
                    aria-hidden
                  />
                ))}
              </div>
              <a
                href={site.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cream/80 px-2.5 py-1.5 text-[11px] font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Open Google reviews"
              >
                <GoogleIcon className="size-4" />
                Google
              </a>
            </div>
            <blockquote className="mt-4 text-base leading-relaxed text-ink">
              “{review.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted">
              <span className="font-semibold text-ink">{review.author}</span>
              {review.role ? ` · ${review.role}` : " · Local Guide on Google"}
            </figcaption>
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Previous review"
                onClick={() =>
                  setIndex(
                    (i) => (i - 1 + site.reviews.length) % site.reviews.length,
                  )
                }
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Next review"
                onClick={() =>
                  setIndex((i) => (i + 1) % site.reviews.length)
                }
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
              <p className="ml-2 text-xs text-muted">
                {index + 1} / {site.reviews.length}
              </p>
            </div>
          </figure>

          <a
            href={site.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <GoogleIcon className="size-4" />
            Read all reviews on Google
          </a>
        </Reveal>
      </div>
    </section>
  );
}
