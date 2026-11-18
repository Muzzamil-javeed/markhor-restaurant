"use client";

import { useState, type ComponentType } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dices,
  Star,
  type LucideProps,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { site } from "@/data/site";

const PERK_ICONS: Record<string, ComponentType<LucideProps>> = {
  "insta-story": Camera,
  "complimentary-tea": Coffee,
  "uno-or-jenga": Dices,
};

export function HomeTableAndReviews() {
  const [index, setIndex] = useState(0);
  const review = site.reviews[index]!;

  return (
    <section className="paper-texture bg-tan">
      <div className="mx-auto grid w-full max-w-[1100px] gap-12 px-4 py-16 lg:grid-cols-2 lg:py-20">
        <Reveal>
          <SectionEyebrow>At the table</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Little extras, big mood.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {site.perks.map((perk) => {
              const Icon = PERK_ICONS[perk.id] ?? Coffee;
              return (
                <li
                  key={perk.id}
                  className="group flex gap-3.5 rounded-2xl border border-dashed border-brand/35 bg-cream/70 px-4 py-4 transition-colors duration-300 hover:border-brand/55 hover:bg-cream"
                >
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand shadow-[inset_0_0_0_1px_rgba(94,15,29,0.08)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-eyebrow text-[10px] font-semibold text-brand uppercase">
                      Stamp
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-ink">
                      {perk.title}
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

          <figure className="mt-8 rounded-2xl border border-line bg-cream p-5 sm:p-6">
            <div className="flex gap-1 text-brand" role="img" aria-label="5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-brand" aria-hidden />
              ))}
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
                  setIndex((i) => (i - 1 + site.reviews.length) % site.reviews.length)
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
            className="mt-5 inline-flex text-sm font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Read all reviews on Google
          </a>
        </Reveal>
      </div>
    </section>
  );
}
