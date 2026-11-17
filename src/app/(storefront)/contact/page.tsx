import type { Metadata } from "next";
import { site } from "@/data/site";
import { displayPhone, telHref } from "@/lib/phone";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Call or visit Markhor Restaurant in DHA Phase 6, Karachi. ${site.phone}`,
  path: "/contact",
});

export default function ContactPage() {
  const phone = displayPhone();

  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-4 py-12">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Contact
      </h1>
      <p className="max-w-xl text-muted">{site.address}</p>
      <a
        href={telHref()}
        className="w-fit text-brand underline-offset-4 hover:underline"
      >
        {phone}
      </a>
    </main>
  );
}
