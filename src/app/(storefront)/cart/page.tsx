import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cart",
  description: "Review your Markhor order, apply a voucher, and checkout.",
  path: "/cart",
});

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Order
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-ink">
          Your cart
        </h1>
      </header>
      <CartPageClient />
    </main>
  );
}
