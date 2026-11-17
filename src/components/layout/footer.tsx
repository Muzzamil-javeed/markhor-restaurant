import Image from "next/image";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { site } from "@/data/site";
import { displayPhone, telHref } from "@/lib/phone";

const explore = [
  { label: "Full menu", href: "/menu" },
  { label: "Track order", href: "/track" },
  { label: "Contact", href: "/contact" },
] as const;

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  const phone = displayPhone();
  const year = COPYRIGHT_YEAR;

  return (
    <footer className="mt-auto border-t border-cream/10 bg-[#0a0506] text-cream">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
          >
            <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-cream/20 bg-white">
              <Image
                src="/logo.png"
                alt="Markhor Restaurant"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            </span>
            <span>
              <span className="font-display block text-2xl leading-none font-bold tracking-[0.06em] text-cream uppercase">
                Markhor
              </span>
              <span className="mt-1 block text-[10px] tracking-[0.2em] text-cream/45 uppercase">
                DHA Phase 6 · KHI
              </span>
            </span>
          </TransitionLink>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/50">
            Smoked meat &amp; western plates out of DHA Phase 6, Karachi.
          </p>
        </div>

        <div>
          <p className="font-eyebrow text-[10px] font-bold tracking-[0.18em] text-cream uppercase">
            Explore
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cream/65">
            {explore.map((link) => (
              <li key={link.href}>
                <TransitionLink
                  href={link.href}
                  className="transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
                >
                  {link.label}
                </TransitionLink>
              </li>
            ))}
            {site.footer.links
              .filter((link) => link.href !== "/contact")
              .map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <p className="font-eyebrow text-[10px] font-bold tracking-[0.18em] text-cream uppercase">
            Order
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cream/65">
            <li>
              <TransitionLink
                href="/menu"
                className="transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
              >
                Order online
              </TransitionLink>
            </li>
            <li>
              <a
                href={telHref()}
                className="transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
              >
                {phone}
              </a>
            </li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
              >
                Instagram
              </a>
            </li>
            <li className="text-cream/40">@markhor.restaurant</li>
          </ul>
        </div>

        <div>
          <p className="font-eyebrow text-[10px] font-bold tracking-[0.18em] text-cream uppercase">
            Location
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cream/65">
            <li className="leading-relaxed">{site.address}</li>
            <li>
              <a
                href={site.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cream underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
              >
                Open in Maps
              </a>
            </li>
            {site.hours.map((block) => (
              <li key={block.id} className="text-cream/45">
                {block.days} · {block.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-4 py-5 font-mono text-[10px] tracking-wide text-cream/35 uppercase sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p>© {year} Markhor Restaurant — Karachi</p>
          <p className="sm:text-center">{site.footer.note}</p>
          <p className="sm:text-right">
            Smoked low · Slow ·{" "}
            <span className="border-b border-cream/50 font-bold text-cream/70">
              Served hot
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
