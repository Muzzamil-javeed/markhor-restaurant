import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of service",
  description: "Terms for ordering from Markhor Restaurant online.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-12">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Terms of service
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Placeholder page. Legal copy will be added before launch.
      </p>
    </main>
  );
}
