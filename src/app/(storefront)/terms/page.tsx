import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import {
  LegalPageHeader,
  LegalSection,
} from "@/components/layout/legal-section";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of service",
  description: "Terms for ordering from Markhor Restaurant online.",
  path: "/terms",
});

const sections = [
  {
    icon: FileText,
    title: "1. Agreement to terms",
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sodales ipsum vel elementum vehicula. Suspendisse sit amet aliquet ex. Pellentesque commodo tortor vel mi volutpat vestibulum. Quisque vel fermentum neque. Maecenas ac velit quam. Sed nec diam et arcu ullamcorper auctor. Aenean cursus nisl lorem, vel facilisis magna blandit ut.",
    ],
  },
  {
    icon: ShoppingBag,
    title: "2. Orders and online takeout",
    body: [
      "Integer egestas mi eros, nec suscipit elit sodales sed. Aliquam a mattis neque. Morbi sed dapibus nunc. Ut vitae diam elit. Sed at nibh orci. Nam sit amet augue eget eros tempor fringilla tincidunt non enim. Vivamus velit mi, egestas finibus elementum quis, pharetra a felis. Curabitur et ex augue. Curabitur et elementum ante. Vestibulum sit amet nunc enim. Sed turpis mi, malesuada in auctor ut, dictum at purus. Integer lectus dolor, pharetra auctor lobortis at, dapibus sed est.",
    ],
  },
  {
    icon: Utensils,
    title: "3. Menu, pricing and availability",
    body: [
      "Etiam vitae mattis mi. Suspendisse bibendum, odio ut ultrices cursus, quam odio maximus odio, nec luctus arcu lectus eget ante. Nunc condimentum condimentum nulla, eu feugiat lorem tincidunt nec. Donec metus orci, elementum ac pellentesque eget, venenatis at mi. Nulla maximus gravida elit, sed hendrerit purus lobortis sit amet. In porttitor enim et ligula aliquet, ac bibendum urna ullamcorper. Vestibulum consectetur ligula at neque lobortis lobortis. Nunc condimentum ex leo, convallis aliquet dolor consectetur eu. Morbi at ligula tellus. Donec purus eros, aliquam vel nunc ut, consectetur tristique diam. Suspendisse sollicitudin at nibh a hendrerit. In eu vulputate massa.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "4. Guest responsibilities",
    body: [
      "Fusce gravida ligula magna, vel placerat dui dignissim sed. Phasellus ultricies eleifend felis, in ultricies purus porta sagittis. Mauris purus urna, consectetur et turpis cursus, pellentesque suscipit massa. Pellentesque auctor lacus eget leo interdum ultricies. Etiam rhoncus, enim aliquam tempus sollicitudin, augue libero dignissim augue, sed vehicula neque arcu ut ex. Nullam pharetra venenatis nunc eget bibendum. Fusce risus diam, egestas quis justo sit amet, aliquet varius sem. Vivamus dignissim convallis diam sed ornare. Nam suscipit cursus condimentum. Sed ut leo sodales, vulputate tellus eget, dapibus ante. Pellentesque porttitor, est laoreet vulputate dapibus, ipsum justo pharetra felis, sit amet tempus lectus enim non tortor.",
    ],
  },
  {
    icon: Scale,
    title: "5. Changes and governing terms",
    body: [
      "Suspendisse ac sollicitudin velit, vitae ultricies erat. Ut vulputate elementum odio nec cursus. In sollicitudin tellus nec gravida finibus. Morbi maximus eget elit a tempus. Donec in leo quis elit sollicitudin laoreet vel id ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent non est pellentesque, lobortis lectus eu, eleifend orci. Suspendisse gravida molestie urna ac luctus. Sed vel molestie nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin ut luctus odio.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[800px] px-4 py-12 sm:py-16">
      <LegalPageHeader
        eyebrow="Legal"
        title="Markhor Restaurant Terms of Service"
        updated="Last Updated: April 3, 2020"
      />

      <p className="mt-6 text-base leading-relaxed text-ink/85">
        These terms apply when you browse or place an order through Markhor
        Restaurant’s website and related online ordering services. By using the
        site you agree to the sections below.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {sections.map((section) => (
          <LegalSection
            key={section.title}
            icon={section.icon}
            title={section.title}
          >
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </LegalSection>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        Also see our{" "}
        <Link
          href="/privacy"
          className="font-medium text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Privacy policy
        </Link>
        .
      </p>
    </main>
  );
}
