"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import { useOpenNow } from "@/hooks/use-open-now";
import { cn } from "@/lib/cn";
import { selectItemCount, useCartStore } from "@/store/cart";

type CartCheckoutButtonProps = {
  className?: string;
  onNavigate?: () => void;
};

/** Checkout stays available when closed so guests can schedule (Module 8). */
export function CartCheckoutButton({
  className,
  onNavigate,
}: CartCheckoutButtonProps) {
  const lines = useCartStore((state) => state.lines);
  const count = selectItemCount(lines);
  const { ready, isOpen, closedMessage } = useOpenNow();
  const disabled = count === 0;

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-brand/40 px-4 text-sm font-semibold text-on-brand",
          className,
        )}
      >
        Checkout
      </button>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <TransitionLink
        href="/checkout"
        transitionLabel="Checkout"
        onClick={onNavigate}
        className="ui-press inline-flex h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        Checkout
      </TransitionLink>
      {ready && !isOpen ? (
        <p className="text-center text-xs text-muted" role="status">
          {closedMessage} — you can still schedule for later.
        </p>
      ) : null}
    </div>
  );
}

