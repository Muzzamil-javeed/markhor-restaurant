import type { Metadata } from "next";
import { Suspense } from "react";
import { LegacyConfirmationRedirect } from "@/components/order/legacy-confirmation-redirect";

export const metadata: Metadata = {
  title: "Order confirmed",
};

/** Legacy Module 8 URL — client redirect to /order/[code]?token=… */
export default function LegacyOrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="px-4 py-10 text-center text-sm text-muted">
          Redirecting…
        </main>
      }
    >
      <LegacyConfirmationRedirect />
    </Suspense>
  );
}
