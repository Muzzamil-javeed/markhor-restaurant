import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Montserrat, Source_Sans_3 } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { TransitionRoot } from "@/components/transition/TransitionRoot";
import {
  buildPageMetadata,
  restaurantJsonLd,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/seo";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  adjustFontFallback: true,
  // Don't compete with the hero LCP image on the critical network path.
  preload: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
  }),
  title: {
    default: SITE_TITLE,
    template: `%s · Markhor Restaurant`,
  },
  applicationName: "Markhor Restaurant",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5E0F1D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${montserrat.variable} ${sourceSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col text-ink"
        suppressHydrationWarning
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
html,body{background-color:#5E0F1D}
html.mk-ready,html.mk-ready body{background-color:#f6f4f2}
#mk-boot-shell{position:fixed;inset:0;width:100%;height:100%;min-height:100dvh;z-index:120;pointer-events:none;opacity:1;transition:opacity .5s cubic-bezier(0.22,1,0.36,1);background:#5E0F1D}
#mk-boot-shell[data-hidden="1"]{display:none!important}
#mk-boot-shell[data-fading="1"]{opacity:0}
noscript #mk-boot-shell{display:none!important}
`,
          }}
        />
        <noscript>
          <style>{`#mk-boot-shell,#mk-preloader{display:none!important}html,body{background-color:#f6f4f2}`}</style>
        </noscript>
        <div id="mk-boot-shell" aria-hidden="true" suppressHydrationWarning />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var el=document.getElementById("mk-boot-shell");var ready=function(){document.documentElement.classList.add("mk-ready")};if(!el){ready();return}try{var p=location.pathname;var admin=p==="/admin"||p.indexOf("/admin/")===0;var seen=sessionStorage.getItem("mk_preloader_seen")==="1";if(admin){el.setAttribute("data-hidden","1");ready();return}if(seen){requestAnimationFrame(function(){requestAnimationFrame(function(){el.setAttribute("data-fading","1");window.setTimeout(function(){el.setAttribute("data-hidden","1");ready()},520)})});return}}catch(e){el.setAttribute("data-hidden","1");ready()}})();`,
          }}
        />
        <JsonLd data={restaurantJsonLd()} />
        <TransitionRoot>{children}</TransitionRoot>
      </body>
    </html>
  );
}
