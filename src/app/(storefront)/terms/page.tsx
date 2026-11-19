import type { Metadata } from "next";
import Link from "next/link";
import { TermsOfServiceBody } from "@/components/layout/terms-of-service-body";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of service",
  description: "Terms for ordering from Markhor Smoked Meat online.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden paper-texture bg-cream">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 8% 0%, rgba(94,15,29,0.07), transparent 45%), radial-gradient(ellipse at 100% 20%, rgba(94,15,29,0.04), transparent 40%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[720px] px-4 py-14 sm:py-20">
        <header>
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.2em] text-brand uppercase">
            Legal
          </p>
          <h1 className="font-display mt-3 text-4xl leading-[0.95] tracking-wide text-ink uppercase sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            Markhor Smoked Meat
          </p>
          <p className="mt-4 text-sm text-muted">
            Last updated:{" "}
            <time dateTime="2026-11-19">19 November 2026</time>
          </p>
          <div className="mt-8 h-px w-16 bg-brand/40" aria-hidden />
        </header>

        <div className="mt-8 space-y-4 text-[15px] leading-[1.75] text-ink/80 sm:text-base">
          <p>
            These terms apply when you browse or place an order through the
            website of Markhor Smoked Meat (“Markhor”, “we”, “us”, “our”) at{" "}
            <a
              href="https://markhorsmokedmeat.com"
              className="font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              markhorsmokedmeat.com
            </a>{" "}
            and our related online ordering service. Markhor is a restaurant
            located at Shop 1, Plot 11C, Khayaban-e-Nishat, D.H.A Phase 6,
            Karachi 75500. By using the website or placing an order, you agree
            to the sections below. If you do not agree, please do not place an
            order.
          </p>
        </div>

        <TermsOfServiceBody />

        <p className="mt-16 border-t border-line/80 pt-8 text-sm text-muted">
          Also see our{" "}
          <Link
            href="/privacy"
            className="font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
