"use client";

import { HomeSection } from "@/components/home/section";
import { site } from "@/data/site";
import { useToastStore } from "@/store/toast";

export function HomeOffers() {
  const showToast = useToastStore((state) => state.show);

  return (
    <HomeSection
      id="offers"
      eyebrow="Offers"
      title="Save on lunch and delivery"
      description="Copy a voucher code and apply it at checkout."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {site.offers.map((offer) => (
          <li
            key={offer.id}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-lg font-semibold text-ink">
                {offer.name} {`${offer.percentOff}%`} off
              </h3>
              <p className="text-sm text-muted">{offer.summary}</p>
              <p className="mt-2 font-mono text-sm font-semibold tracking-wide text-brand uppercase">
                {offer.code}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-fit items-center rounded-xl bg-brand px-4 text-sm font-medium text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(offer.code);
                  showToast(`Copied ${offer.code}`);
                } catch {
                  showToast(`Code: ${offer.code}`);
                }
              }}
            >
              Copy code
            </button>
            <p className="text-xs text-muted">
              {offer.appliesTo === "delivery"
                ? "Valid on delivery orders only. One code per order. Cannot be combined with other offers."
                : "Daily 1 PM to 4 PM, Asia/Karachi. One code per order. Cannot be combined with other offers."}
            </p>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
