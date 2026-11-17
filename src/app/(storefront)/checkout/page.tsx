import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description: "Confirm your Markhor order, schedule if needed, and place it.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Checkout
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-ink">
          Place your order
        </h1>
      </header>
      <CheckoutForm />
    </main>
  );
}
