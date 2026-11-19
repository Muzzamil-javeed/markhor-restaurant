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

function Subhead({ children }: { children: ReactNode }) {
  return (
    <p className="font-heading pt-1 text-[15px] font-semibold text-ink">
      {children}
    </p>
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

/** Full terms copy — editorial layout, no cards. */
export function TermsOfServiceBody() {
  const phone = displayPhone();

  return (
    <div className="mt-14 flex flex-col gap-12">
      <Section number="01" title="Agreement to terms">
        <p>
          By accessing this website or placing an order, you confirm that you
          have read, understood and agree to these Terms of Service and our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Privacy Policy
          </Link>
          . You must be at least 18 years old, or be using the website with the
          permission of a parent or guardian, to place an order. These terms
          apply to all visitors and customers of the website.
        </p>
      </Section>

      <Section number="02" title="Orders and delivery">
        <Subhead>How ordering works</Subhead>
        <p>
          You can place an order on our website as a guest. You do not need to
          create an account. You will be asked for your name, phone number,
          delivery address and order details.
        </p>

        <Subhead>Order confirmation</Subhead>
        <p>
          Placing an order on the website is a request to buy, not a guaranteed
          acceptance. An order is confirmed only when our team accepts it, which
          we normally do by calling you on the phone number you provided. We do
          not currently send confirmations by SMS, WhatsApp or email. Please
          make sure your phone number is correct and that you can answer our
          call.
        </p>

        <Subhead>Payment</Subhead>
        <p>
          We currently accept Cash on Delivery (COD) only. Please pay the full
          amount in cash to our rider on delivery, and keep the exact change
          ready where possible. If we introduce online payments in the future,
          we will update these terms.
        </p>

        <Subhead>Delivery</Subhead>
        <p>
          We deliver within the areas we serve, and delivery time is an estimate
          only. Delivery times may be affected by traffic, weather, order volume
          or other factors outside our control. Delivery charges, if any, will
          be shown or confirmed before your order is accepted. Please provide a
          complete and accurate address and be available to receive the order.
        </p>

        <Subhead>Failed delivery</Subhead>
        <p>
          If we cannot reach you by phone, the address is incorrect or
          incomplete, or no one is available to receive and pay for the order,
          we may cancel the order. We may refuse future orders from numbers or
          addresses with repeated failed deliveries or fake orders.
        </p>

        <Subhead>Cancellations and changes</Subhead>
        <p>
          To change or cancel an order, please call us as soon as possible on{" "}
          <a
            href={telHref()}
            className="font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {phone}
          </a>
          . We can usually cancel or change an order only before preparation
          begins. Because our food is freshly prepared, we may be unable to
          cancel once cooking has started.
        </p>

        <Subhead>Problems with your order</Subhead>
        <p>
          If an item is missing, incorrect or not up to standard, please tell us
          on the phone number above immediately on delivery or as soon as
          possible afterwards. We will review each case and, where appropriate,
          replace the item or offer a correction or refund at our discretion.
        </p>
      </Section>

      <Section number="03" title="Menu, pricing and availability">
        <p>
          All menu items, descriptions, images and prices on the website are
          provided in good faith, but may change without notice. Prices are in
          Pakistani Rupees (PKR) and may or may not include applicable taxes and
          delivery charges, as shown at the time of ordering. Product photos are
          for illustration, and the actual dish may look slightly different.
        </p>
        <p>
          Items may sometimes be unavailable because of stock, timing or kitchen
          capacity. If an item is unavailable, we will contact you to offer a
          substitute or remove it from your order. We reserve the right to
          correct pricing or menu errors, and to cancel or amend an order
          affected by such an error, after informing you.
        </p>

        <Subhead>Allergies and dietary needs</Subhead>
        <p>
          Our kitchen handles meat, spices, dairy, gluten, nuts and other common
          allergens, and we cannot guarantee that any item is free from allergens
          or cross-contact. If you have an allergy or special dietary
          requirement, please tell us when you order by phone before we confirm
          it.
        </p>
      </Section>

      <Section number="04" title="Guest responsibilities">
        <p>When you use the website or place an order, you agree to:</p>
        <BulletList
          items={[
            "Provide accurate, complete and current information, including a working phone number and correct delivery address",
            "Place genuine orders only, and not submit false, prank or repeated fake orders",
            "Be available to receive the order and pay on delivery",
            "Treat our staff and delivery riders with respect",
            "Not misuse the website, including attempting to interfere with its operation, access it without permission, or use it for unlawful purposes",
            "Not copy, scrape or reuse our content, images, logo or menu for commercial purposes without our written permission",
          ]}
        />
        <p>
          We may refuse, cancel or suspend service to anyone who breaches these
          responsibilities.
        </p>
      </Section>

      <Section number="05" title="Intellectual property">
        <p>
          The Markhor name, logo, website design, text, photos and menu content
          belong to Markhor or its licensors and are protected by applicable
          laws. You may view and use the website for personal, non-commercial
          ordering only.
        </p>
      </Section>

      <Section number="06" title="Limitation of liability">
        <p>
          We work to keep the website accurate and available, but we do not
          guarantee that it will always be uninterrupted or error-free. To the
          fullest extent permitted by law, Markhor is not liable for indirect or
          consequential losses arising from your use of the website, delays in
          delivery caused by events beyond our reasonable control, or the
          content of third-party websites we link to (such as Google Maps,
          Instagram and Facebook). Nothing in these terms limits any rights you
          have under applicable consumer protection law or any liability that
          cannot legally be limited.
        </p>
      </Section>

      <Section number="07" title="Changes and governing terms">
        <p>
          We may update these terms from time to time, for example if we add new
          features such as customer accounts, online payments or order
          notifications. The “Last Updated” date at the top shows when they were
          last changed. The terms in force at the time you place your order will
          apply to that order, and continuing to use the website after an update
          means you accept the updated terms.
        </p>
        <p>
          These terms are governed by the laws of Pakistan, and any dispute will
          be subject to the courts of Karachi, Sindh, unless the law requires
          otherwise.
        </p>
      </Section>

      <Section number="08" title="Contact us">
        <p>
          Questions about these terms? Call us on{" "}
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
