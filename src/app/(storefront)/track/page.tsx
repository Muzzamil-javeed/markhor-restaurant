import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrderClient } from "@/components/order/track-order-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Track order",
  description:
    "Look up your Markhor order with the code and phone number from checkout.",
  path: "/track",
});

export default function TrackPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-4 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Tracking
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-ink">
          Track your order
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter the order code and the phone number used at checkout. Status
          refreshes every 15 seconds.
        </p>
      </header>
      <Suspense
        fallback={<p className="text-sm text-muted">Loading tracker…</p>}
      >
        <TrackOrderClient />
      </Suspense>
    </main>
  );
}
