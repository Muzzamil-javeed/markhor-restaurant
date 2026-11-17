"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomeSection } from "@/components/home/section";
import { site } from "@/data/site";

export function HomeReviews() {
  const reviews = site.reviews;
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  const previous = () =>
    setIndex((current) => (current - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((current) => (current + 1) % reviews.length);

  return (
    <HomeSection
      id="reviews"
      eyebrow="Guests"
      title="What guests say"
      description="Five-star notes from Google Maps."
      className="bg-tint/35"
    >
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div
          className="flex flex-col gap-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm font-medium tracking-wide text-brand">
            ★★★★★
          </p>
          <blockquote className="font-heading text-xl leading-relaxed text-ink sm:text-2xl">
            “{review.quote}”
          </blockquote>
          <p className="text-sm text-muted">
            {review.author}
            {review.role ? ` · ${review.role}` : ""}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={previous}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="Previous review"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="Next review"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <p className="text-sm text-muted">
            {index + 1} of {reviews.length}
          </p>
          <a
            href={site.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Read all reviews on Google
          </a>
        </div>
      </div>
    </HomeSection>
  );
}
