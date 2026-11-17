import type { Metadata } from "next";
import { HomeFindUs } from "@/components/home/find-us";
import { HomeHero } from "@/components/home/hero";
import { HomeHowItWorks } from "@/components/home/how-it-works";
import { HomeMenuPreview } from "@/components/home/menu-preview";
import { HomeOffersBoard } from "@/components/home/offers-board";
import { HomePopularPicks } from "@/components/home/popular-picks";
import { HomeTableAndReviews } from "@/components/home/table-and-reviews";
import { HomeTicker } from "@/components/home/ticker";
import { buildPageMetadata, SITE_TITLE } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_TITLE,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <main>
      <link
        rel="preload"
        as="image"
        href="/images/hero.avif"
        type="image/avif"
        fetchPriority="high"
      />
      <HomeHero />
      <HomeTicker />
      <HomeOffersBoard />
      <HomeMenuPreview />
      <HomeHowItWorks />
      <HomePopularPicks />
      <HomeTableAndReviews />
      <HomeFindUs />
    </main>
  );
}
