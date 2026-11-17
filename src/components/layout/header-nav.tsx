"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { HeaderTone } from "@/components/layout/header-tone";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/track", label: "Track order" },
] as const;

export function HeaderNav({
  className,
  mobile = false,
  tone = "solid",
}: {
  className?: string;
  mobile?: boolean;
  tone?: HeaderTone;
}) {
  const pathname = usePathname();
  const overlay = tone === "overlay";

  return (
    <nav
      aria-label={mobile ? "Mobile" : "Primary"}
      className={className}
    >
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <TransitionLink
            key={item.href}
            href={item.href}
            transitionLabel={item.label}
            className={cn(
              "relative font-eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2",
              mobile ? "shrink-0 rounded-lg px-3 py-2" : "px-3 py-2",
              overlay
                ? "focus-visible:ring-white/40"
                : "focus-visible:ring-brand/40",
              overlay
                ? active
                  ? "text-white"
                  : "text-white/60 hover:text-white"
                : active
                  ? "text-brand"
                  : "text-ink/65 hover:text-brand",
            )}
          >
            {item.label}
            {active ? (
              <motion.span
                layoutId={
                  mobile ? "mk-nav-underline-mobile" : "mk-nav-underline"
                }
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px transition-colors duration-300 ease-out",
                  overlay ? "bg-white" : "bg-brand",
                )}
                transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
          </TransitionLink>
        );
      })}
    </nav>
  );
}
