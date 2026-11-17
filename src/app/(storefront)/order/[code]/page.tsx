import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderPageClient } from "@/components/order/order-page-client";

/** Dynamic code + search token; allow request-time render. */
export const instant = false;

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Order ${decodeURIComponent(code).toUpperCase()}`,
    description: "Your Markhor order confirmation and live status.",
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { code } = await params;
  const normalised = decodeURIComponent(code).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-[640px] px-4 py-10">
      <Suspense
        fallback={
          <p className="text-center text-sm text-muted">Loading order…</p>
        }
      >
        <OrderPageClient code={normalised} />
      </Suspense>
    </main>
  );
}
