import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description: "How Markhor Restaurant handles guest data for online orders.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-12">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Privacy policy
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Placeholder page. Privacy copy will be added before launch.
      </p>
    </main>
  );
}
