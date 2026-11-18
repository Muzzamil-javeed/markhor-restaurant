"use client";

import { CartCheckoutButton } from "@/components/cart/cart-checkout-button";
import { CartEmpty } from "@/components/cart/cart-empty";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartOrderType } from "@/components/cart/cart-order-type";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartUpsellBlocks } from "@/components/cart/cart-upsell";
import { CartVoucher } from "@/components/cart/cart-voucher";
import { selectItemCount, useCartStore } from "@/store/cart";
import { useCartHydration } from "@/store/use-cart-hydration";

type CartPanelProps = {
  onBrowse?: () => void;
  onCheckoutNavigate?: () => void;
};

export function CartPanel({ onBrowse, onCheckoutNavigate }: CartPanelProps) {
  const hydrated = useCartHydration();
  const lines = useCartStore((state) => state.lines);
  const count = hydrated ? selectItemCount(lines) : 0;

  if (!hydrated) {
    return (
      <div className="py-8 text-sm text-muted" aria-busy="true">
        Loading cart…
      </div>
    );
  }

  if (count === 0) {
    return <CartEmpty onBrowse={onBrowse} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <CartOrderType />

      <ul className="flex flex-col">
        {lines.map((line) => (
          <CartLineItem key={line.key} line={line} />
        ))}
      </ul>

      <CartUpsellBlocks />
      <CartVoucher />

      <CartSummary />
      <CartCheckoutButton onNavigate={onCheckoutNavigate} />
    </div>
  );
}
