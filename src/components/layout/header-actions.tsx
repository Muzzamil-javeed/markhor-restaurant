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
