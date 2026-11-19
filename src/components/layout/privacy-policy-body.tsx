import type { ReactNode } from "react";
import Link from "next/link";
import { displayPhone, telHref } from "@/lib/phone";

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-24 border-t border-line/80 pt-10">
      <h2 className="font-display flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl tracking-wide text-ink uppercase sm:text-3xl">
        <span className="font-eyebrow text-[11px] font-semibold tracking-[0.2em] text-brand">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-ink/80 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 pl-0">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-brand"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Full privacy policy copy — editorial layout, no cards. */
export function PrivacyPolicyBody() {
  const phone = displayPhone();

  return (
    <div className="mt-14 flex flex-col gap-12">
      <Section number="01" title="Information we collect">
        <p className="font-heading text-[15px] font-semibold text-ink">
          Information you give us when you place an order
        </p>
        <p>
          Our Website lets you order without creating an account. When you place
          an order, we ask for:
        </p>
        <BulletList
          items={[
            "Your name and phone number",
            "Your delivery address (and any landmark or delivery instructions you add)",
            "Your order details: items, quantities, special instructions, and the date and time of the order",
            "Your chosen payment method (currently Cash on Delivery)",
          ]}
        />

        <p className="font-heading pt-2 text-[15px] font-semibold text-ink">
          Payment information
        </p>
        <p>
          We currently accept Cash on Delivery only. We do not collect or store
          any card, bank or mobile wallet details on the Website. If we
          introduce online payments in the future, they will be handled by a
          payment provider, and we will update this policy before that happens.
        </p>

        <p className="font-heading pt-2 text-[15px] font-semibold text-ink">
          Information collected automatically
        </p>
        <p>
          Like most websites, our Website automatically collects some technical
          information when you visit, such as your IP address, device and
          browser type, the pages you view, and how you reached the site. We use
          this to understand how the Website is used and to measure our
          advertising.
        </p>
      </Section>

      <Section number="02" title="How we use your information">
        <p>We use your information to:</p>
        <BulletList
          items={[
            "Receive, prepare and deliver your order",
            "Call you to confirm your order, address or any change or delay",
            "Keep a record of orders for accounting, tax and customer service",
            "Handle complaints, refunds or order issues",
            "Improve our menu, Website and delivery service",
            "Measure the performance of our Website and advertising",
            "Prevent fraud, misuse and fake orders",
            "Meet legal obligations",
          ]}
        />
        <p>
          We do not send order updates by SMS, WhatsApp or email at this time.
          If we need to reach you about your order, we will call the phone
          number you provided.
        </p>
      </Section>

      <Section number="03" title="Who we share information with">
        <p>
          We do not sell your personal information. We share it only where
          needed:
        </p>
        <BulletList
          items={[
            "Our delivery staff or riders: your name, phone number and address, only to deliver your order.",
            "Service providers: companies that help us run the Website, such as hosting and technical support, who may only use your data to provide services to us.",
            "Analytics and advertising partners: Google and Meta (see Section 4).",
            "Authorities: if required by law, a court order or a lawful request, or to protect our rights, staff, customers or safety.",
          ]}
        />
      </Section>

      <Section number="04" title="Cookies and tracking tools">
        <p>Our Website uses cookies and similar technologies for:</p>
        <BulletList
          items={[
            "Essential functions: for example, remembering the items in your cart while you order.",
            "Analytics: Google Analytics (Google) to measure visits and which pages are viewed.",
            "Advertising: Meta Pixel (Meta Platforms) to measure the results of our ads on Facebook and Instagram and, where enabled, to reach people who have visited our Website.",
          ]}
        />
        <p>
          You can block or delete cookies in your browser settings, though your
          cart may not work properly if you block essential cookies. You can
          manage ad personalisation through your Google account ad settings and
          your Facebook and Instagram ad preferences.
        </p>
      </Section>

      <Section number="05" title="Orders and enquiries by phone">
        <p>
          If you call us to order or ask a question, we use the details you give
          us, such as your name, phone number, delivery address and order, to
          prepare and deliver your order and to reply to you.
        </p>
      </Section>

      <Section number="06" title="Data security">
        <p>
          We take reasonable steps to protect your information, including secure
          (HTTPS) connections and limiting access to order information to
          authorised Markhor staff who need it for their work. No online system
          is completely secure, so we cannot guarantee absolute security.
        </p>
      </Section>

      <Section number="07" title="How long we keep your information">
        <p>
          We keep order records (name, phone number, address and order details)
          only as long as needed for the purposes above, including delivery,
          customer service and our accounting and legal requirements, after
          which they are deleted or anonymised.
        </p>
      </Section>

      <Section number="08" title="Your choices">
        <p>
          You can contact us to ask what information we hold about your orders,
          to correct it, or to ask us to delete it, subject to our legal and
          record-keeping requirements. You can call us using the details below.
        </p>
      </Section>

      <Section number="09" title="Links to other sites">
        <p>
          Our Website links to Google Maps, Instagram and Facebook. These are
          run by other companies with their own privacy policies, and we are not
          responsible for how they handle your information.
        </p>
      </Section>

      <Section number="10" title="Children">
        <p>
          This Website is not aimed at children under 13, and we do not
          knowingly collect information from them.
        </p>
      </Section>

      <Section number="11" title="Changes to this policy">
        <p>
          We may update this policy from time to time, for example if we add new
          features such as customer accounts or online payments. The “Last
          updated” date at the top shows when it was last changed.
        </p>
      </Section>

      <Section number="12" title="Contact us">
        <p>
          Questions about this policy? Call us on{" "}
          <a
            href={telHref()}
            className="font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {phone}
          </a>{" "}
          or visit us at Shop 1, Plot 11C, Khayaban-e-Nishat, D.H.A Phase 6,
          Karachi 75500. You can find all our details on the{" "}
          <Link
            href="/contact"
            className="font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Contact
          </Link>{" "}
          page.
        </p>
      </Section>
    </div>
  );
}
