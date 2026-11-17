import type { Metadata } from "next";
import Link from "next/link";
import {
  Baby,
  Cookie,
  Database,
  ExternalLink,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react";
import {
  LegalPageHeader,
  LegalSection,
} from "@/components/layout/legal-section";
import { displayPhone, telHref } from "@/lib/phone";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description: "How Markhor Restaurant handles guest data for online orders.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const phone = displayPhone();

  return (
    <main className="mx-auto w-full max-w-[800px] px-4 py-12 sm:py-16">
      <LegalPageHeader
        eyebrow="Legal"
        title="Privacy policy"
        updated="Last updated: October 26, 2026"
      />

      <p className="mt-6 text-base leading-relaxed text-ink/85">
        This policy explains how Markhor Smoked Meat (“Markhor”, “we”, “us”)
        handles information when you visit markhorsmokedmeat.com. Markhor is a
        restaurant at Shop 1, Plot 11C, Khayaban-e-Nishat, D.H.A Phase 6,
        Karachi 75500.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <LegalSection icon={Database} title="What we collect">
          <p>
            Our website is a menu and information site. It has no customer
            accounts, no online checkout and no forms, and we do not ask you to
            enter personal details on it.
          </p>
          <p>
            Like most websites, it collects some technical information
            automatically when you visit, such as your IP address, device and
            browser type, the pages you view and how you reached the site. We
            use this to understand how the site is used and to measure our
            advertising.
          </p>
        </LegalSection>

        <LegalSection icon={Cookie} title="Cookies and tracking tools">
          <p>
            To do this, the site uses two tools that may set cookies on your
            device:
          </p>
          <ul className="list-none space-y-2">
            <li className="flex gap-2 rounded-xl bg-[#faf7f5] px-3 py-2.5">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>
                <span className="font-semibold text-ink">Google Analytics</span>{" "}
                (Google) to measure visits and which pages are viewed.
              </span>
            </li>
            <li className="flex gap-2 rounded-xl bg-[#faf7f5] px-3 py-2.5">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>
                <span className="font-semibold text-ink">Meta Pixel</span> (Meta
                Platforms) to measure the results of our ads on Facebook and
                Instagram and, where enabled, to reach people who have visited
                our website.
              </span>
            </li>
          </ul>
          <p>
            You can block or delete cookies in your browser settings. You can
            also manage ad personalisation through your Google account ad
            settings and your Facebook and Instagram ad preferences.
          </p>
        </LegalSection>

        <LegalSection icon={Phone} title="Orders and enquiries by phone">
          <p>
            If you call us to order or ask a question, we use the details you
            give us, such as your name, phone number, delivery address and
            order, to prepare and deliver your order and to reply to you. We do
            not sell your personal information.
          </p>
        </LegalSection>

        <LegalSection icon={ExternalLink} title="Links to other sites">
          <p>
            Our site links to Google Maps, Instagram and Facebook. These are run
            by other companies with their own privacy policies, and we are not
            responsible for how they handle your information.
          </p>
        </LegalSection>

        <LegalSection icon={Baby} title="Children">
          <p>
            This website is not aimed at children under 13, and we do not
            knowingly collect information from them.
          </p>
        </LegalSection>

        <LegalSection icon={RefreshCw} title="Changes to this policy">
          <p>
            We may update this policy from time to time. The date at the top
            shows when it was last changed.
          </p>
        </LegalSection>

        <LegalSection icon={MapPin} title="Contact us">
          <p>
            Questions about this policy? Call us on{" "}
            <a
              href={telHref()}
              className="font-semibold text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              {phone}
            </a>{" "}
            or visit us at Shop 1, Plot 11C, Khayaban-e-Nishat, D.H.A Phase 6,
            Karachi 75500. You can find all our details on the{" "}
            <Link
              href="/contact"
              className="font-semibold text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              Contact
            </Link>{" "}
            page.
          </p>
        </LegalSection>
      </div>

      <p className="mt-8 text-sm text-muted">
        Also see our{" "}
        <Link
          href="/terms"
          className="font-medium text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Terms of service
        </Link>
        .
      </p>
    </main>
  );
}
