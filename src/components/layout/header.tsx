"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import {
  HeaderDesktopActions,
  HeaderMobileStatus,
} from "@/components/layout/header-actions";
import { HeaderHeightSync } from "@/components/layout/header-height";
import { HeaderNav } from "@/components/layout/header-nav";
import { TransitionLink } from "@/components/transition/TransitionLink";
import type { HeaderTone } from "@/components/layout/header-tone";
import { cn } from "@/lib/cn";
import { displayPhone, telHref } from "@/lib/phone";

/** Hysteresis stops flicker when scroll sits near the threshold. */
const SCROLL_ON = 48;
const SCROLL_OFF = 12;

export function Header() {
  const phone = displayPhone();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > SCROLL_ON) return true;
        if (prev && y < SCROLL_OFF) return false;
        return prev;
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const tone: HeaderTone = isHome && !scrolled ? "overlay" : "solid";
  const overlay = tone === "overlay";

  const phoneLink = (
    <a
      href={telHref()}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2",
        overlay
          ? "border-white/25 text-white/90 hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
          : "border-line text-ink hover:border-brand/30 hover:bg-tint hover:text-brand focus-visible:ring-brand/40",
      )}
      aria-label={`Call Markhor at ${phone}`}
    >
      <Phone className="size-4" aria-hidden />
    </a>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        overlay ? "text-white" : "text-ink",
      )}
    >
      {/* Fixed-height chrome — never animate height (that causes scroll jerk). */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 border-b transition-[opacity,background-color,border-color,box-shadow] duration-300 ease-out",
          overlay
            ? "border-transparent bg-transparent opacity-0 shadow-none"
            : "border-line bg-[#F6F4F2]/92 opacity-100 shadow-[0_8px_24px_rgba(36,26,27,0.07)] backdrop-blur-md",
        )}
        aria-hidden
      />
      <HeaderHeightSync />
      <div className="relative mx-auto flex h-14 w-full max-w-[1400px] items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <TransitionLink
          href="/"
          transitionLabel="Home"
          className={cn(
            "inline-flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2",
            overlay
              ? "focus-visible:ring-white/40"
              : "focus-visible:ring-brand/40",
          )}
          aria-label="Markhor Restaurant home"
        >
          <span
            className={cn(
              "relative flex size-10 items-center justify-center rounded-full border transition-colors duration-300 ease-out sm:size-11",
              overlay
                ? "border-white/30 bg-white/10"
                : "border-line bg-white shadow-[0_0_16px_rgba(94,15,29,0.08)]",
            )}
          >
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className={cn(
                "size-7 object-contain transition-[filter] duration-300 ease-out sm:size-8",
                overlay ? "brightness-0 invert" : "brightness-0",
              )}
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-eyebrow text-[0.95rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 ease-out",
                overlay ? "text-white" : "text-ink",
              )}
            >
              Markhor
            </span>
            <span
              className={cn(
                "mt-1 text-[9px] font-medium tracking-[0.28em] uppercase transition-colors duration-300 ease-out",
                overlay ? "text-white/65" : "text-muted",
              )}
            >
              Restaurant
            </span>
          </span>
        </TransitionLink>

        <HeaderNav
          tone={tone}
          className="ml-4 hidden items-center gap-1 md:ml-8 md:flex lg:ml-12"
        />
        <HeaderDesktopActions tone={tone} phoneLink={phoneLink} />
      </div>

      <div
        className={cn(
          "relative flex h-11 items-center gap-1 overflow-x-auto px-4 transition-colors duration-300 ease-out md:hidden",
          overlay
            ? "border-t border-white/10 bg-transparent"
            : "border-t border-line",
        )}
      >
        <HeaderNav tone={tone} mobile className="flex items-center gap-1" />
        <HeaderMobileStatus tone={tone} />
      </div>
    </header>
  );
}
