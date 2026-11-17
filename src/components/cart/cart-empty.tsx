import Image from "next/image";
import { TransitionLink } from "@/components/transition/TransitionLink";

type CartEmptyProps = {
  onBrowse?: () => void;
};

export function CartEmpty({ onBrowse }: CartEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-stretch gap-5 text-ink">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-white">
        <Image
          src="/images/home/cart-banner.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="400px"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"
          aria-hidden
        />
      </div>
      <div>
        <p className="font-heading text-base font-semibold text-ink">
          Your cart is empty
        </p>
        <p className="mt-1 text-sm text-muted">
          Browse the menu and add something smoked.
        </p>
      </div>
      <TransitionLink
        href="/menu"
        transitionLabel="Menu"
        onClick={onBrowse}
        className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        Browse menu
      </TransitionLink>
    </div>
  );
}
