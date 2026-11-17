"use client";

import { site } from "@/data/site";

function buildTickerText(): string {
  const lunch = site.offers.find((o) => o.code === "lunch25");
  const delivery = site.offers.find((o) => o.code === "deliver20");
  const parts = [
    lunch
      ? `Lunch special ${lunch.percentOff}% off · Code ${lunch.code.toUpperCase()} · 1 PM to 4 PM`
      : null,
    delivery
      ? `Delivery ${delivery.percentOff}% off · Code ${delivery.code.toUpperCase()}`
      : null,
    "Smoked 12 hours",
    "Open daily from 12:30 PM",
    "DHA Phase 6",
  ].filter(Boolean);

  return `${parts.join(" · ")} · `;
}

export function HomeTicker() {
  const text = buildTickerText();
  const loop = `${text}${text}`;

  return (
    <div className="overflow-hidden bg-brand py-3 text-cream" aria-hidden>
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <p className="font-eyebrow px-4 text-[11px] font-semibold uppercase">
          {loop}
        </p>
        <p className="font-eyebrow px-4 text-[11px] font-semibold uppercase">
          {loop}
        </p>
      </div>
      <span className="sr-only">
        Lunch special 25% off with code lunch25 from 1 PM to 4 PM. Delivery 20%
        off with code deliver20. Open daily from 12:30 PM in DHA Phase 6.
      </span>
    </div>
  );
}
