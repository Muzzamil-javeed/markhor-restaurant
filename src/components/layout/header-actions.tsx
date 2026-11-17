"use client";

import dynamic from "next/dynamic";
import type { HeaderTone } from "@/components/layout/header-tone";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

function InstagramGlyph({ className }: { className?: string }) {
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

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.86c0-2.37 1.4-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.9h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93Z" />
    </svg>
  );
}

const HeaderCartButton = dynamic(
  () =>
    import("@/components/layout/header-cart-button").then(
      (mod) => mod.HeaderCartButton,
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-xs font-semibold tracking-[0.14em] text-on-brand uppercase">
        Cart
      </span>
    ),
  },
);

const OpenStatusPill = dynamic(
  () =>
    import("@/components/layout/open-status-pill").then(
      (mod) => mod.OpenStatusPill,
    ),
  { ssr: false },
);

export function HeaderDesktopActions({
  phoneLink,
  tone = "solid",
}: {
  phoneLink: React.ReactNode;
  tone?: HeaderTone;
}) {
  const overlay = tone === "overlay";

  return (
    <div className="ml-auto flex items-center gap-2 sm:gap-3">
      <OpenStatusPill
        tone={overlay ? "dark" : "light"}
        className="hidden lg:inline-flex"
      />
      <a
        href={site.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "hidden size-10 items-center justify-center rounded-full border transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 sm:inline-flex",
          overlay
            ? "border-white/25 text-white/85 hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            : "border-line text-ink/80 hover:border-brand/30 hover:bg-tint hover:text-brand focus-visible:ring-brand/40",
        )}
        aria-label="Markhor on Instagram"
      >
        <InstagramGlyph className="size-4" />
      </a>
      <a
        href={site.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "hidden size-10 items-center justify-center rounded-full border transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 sm:inline-flex",
          overlay
            ? "border-white/25 text-white/85 hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            : "border-line text-ink/80 hover:border-brand/30 hover:bg-tint hover:text-brand focus-visible:ring-brand/40",
        )}
        aria-label="Markhor on Facebook"
      >
        <FacebookGlyph className="size-4" />
      </a>
      {phoneLink}
      <HeaderCartButton />
    </div>
  );
}

export function HeaderMobileStatus({ tone = "solid" }: { tone?: HeaderTone }) {
  return (
    <OpenStatusPill
      tone={tone === "overlay" ? "dark" : "light"}
      className="ml-auto"
    />
  );
}
