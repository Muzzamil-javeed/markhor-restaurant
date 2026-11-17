import type { Metadata } from "next";
import { menu } from "@/data/menu";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";

export const SITE_TITLE =
  "Markhor Menu | Western Food in DHA Phase 6, Karachi";

export const SITE_DESCRIPTION = site.meta;

export function absoluteUrl(path = "/"): string {
  const base = siteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(input: {
  title?: string;
  description?: string;
  path?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const title = input.absoluteTitle
    ? { absolute: input.title ?? SITE_TITLE }
    : (input.title ?? SITE_TITLE);
  const description = input.description ?? SITE_DESCRIPTION;
  const url = absoluteUrl(input.path ?? "/");
  const ogImage = absoluteUrl("/logo.png");

  return {
    title,
    description,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url,
      siteName: site.name,
      title: typeof title === "string" ? title : (title.absolute ?? SITE_TITLE),
      description,
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: `${site.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: typeof title === "string" ? title : (title.absolute ?? SITE_TITLE),
      description,
      images: [ogImage],
    },
  };
}

/** Restaurant + Menu JSON-LD for Google rich results. */
export function restaurantJsonLd() {
  const base = siteUrl();
  const openingHours = site.hours.flatMap((block) =>
    block.dayIndexes.map((dayIndex) => {
      const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
        dayIndex
      ];
      const closes = block.closesNextDay
        ? `${block.closes}`
        : block.closes;
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day,
        opens: block.opens,
        closes,
      };
    }),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${base}/#restaurant`,
    name: site.name,
    image: absoluteUrl("/logo.png"),
    url: base,
    telephone: site.phone,
    servesCuisine: ["Western", "Smokehouse", "American"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop 1, Plot 11C Khayaban-e-Nishat, D.H.A Phase 6",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75500",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.800423,
      longitude: 67.0666509,
    },
    openingHoursSpecification: openingHours,
    hasMenu: absoluteUrl("/menu"),
  };
}

/** Full Menu JSON-LD (sections + items) — use on /menu only. */
export function menuJsonLd() {
  const base = siteUrl();
  const menuSections = menu.map((category) => ({
    "@type": "MenuSection",
    name: category.name,
    // Keep Menu schema lean (name + price) so /menu HTML stays small for LCP.
    hasMenuItem: category.items.map((item) => ({
      "@type": "MenuItem",
      name: item.name,
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: String(item.price),
      },
    })),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${base}/menu#menu`,
    name: "Markhor Menu",
    url: absoluteUrl("/menu"),
    hasMenuSection: menuSections,
  };
}
