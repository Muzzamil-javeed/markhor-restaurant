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
    <main className="mx-auto w-full max-w-[760px] px-4 py-8 sm:py-10">
      <header className="mb-8">
        <p className="font-eyebrow text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
          Checkout
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Place your order
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
          Three quick steps — choose how you want it, share your details, then
          confirm.
        </p>
      </header>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_10px_32px_rgba(36,26,27,0.04)] sm:p-5">
        <CheckoutForm />
      </div>
    </main>
  );
}
