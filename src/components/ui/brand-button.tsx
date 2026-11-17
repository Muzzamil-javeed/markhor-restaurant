import type { ComponentProps, ReactNode } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { cn } from "@/lib/cn";

const base =
  "ui-press inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants = {
  solid: "bg-brand text-on-brand hover:bg-brand/90",
  outline:
    "border border-current bg-transparent text-brand hover:bg-tint/60",
  outlineLight:
    "border border-cream/70 bg-transparent text-cream hover:bg-cream/10",
  solidLight: "bg-cream text-brand hover:bg-white",
} as const;

type Variant = keyof typeof variants;

type Shared = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

export function BrandButton({
  children,
  className,
  variant = "solid",
  ...props
}: Shared & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function BrandLink({
  children,
  className,
  variant = "solid",
  href,
  transitionLabel,
  ...props
}: Shared &
  ComponentProps<typeof TransitionLink> & {
    transitionLabel?: string;
  }) {
  return (
    <TransitionLink
      href={href}
      transitionLabel={transitionLabel}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </TransitionLink>
  );
}
