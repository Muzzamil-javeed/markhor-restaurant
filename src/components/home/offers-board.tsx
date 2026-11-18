"use client";

import { useSyncExternalStore, type ComponentType } from "react";
import {
  Camera,
  Coffee,
  Copy,
  Dices,
  SunMedium,
  Truck,
  type LucideProps,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { OffersCoverflow } from "@/components/home/offers-coverflow";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { StatusPulse } from "@/components/ui/status-pulse";
import { getKarachiParts, parseTimeToMinutes } from "@/lib/hours";
import { site } from "@/data/site";
import { useToastStore } from "@/store/toast";
import { cn } from "@/lib/cn";

type LunchStatus = { live: boolean; label: string };
type BoardIcon = ComponentType<LucideProps>;

const LUNCH_SSR: LunchStatus = { live: false, label: "1 PM to 4 PM" };
const LUNCH_LIVE: LunchStatus = { live: true, label: "Live now" };
const LUNCH_BEFORE: LunchStatus = { live: false, label: "Starts 1 PM" };
const LUNCH_AFTER: LunchStatus = { live: false, label: "Ended today" };

function lunchStatus(now = new Date()): LunchStatus {
  const parts = getKarachiParts(now);
  const start = parseTimeToMinutes("13:00");
  const end = parseTimeToMinutes("16:00");
  if (parts.minutesOfDay >= start && parts.minutesOfDay < end) return LUNCH_LIVE;
  if (parts.minutesOfDay < start) return LUNCH_BEFORE;
  return LUNCH_AFTER;
}

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(id);
}

export function HomeOffersBoard() {
  const showToast = useToastStore((state) => state.show);
  const reduce = useReducedMotion();
  const lunch = useSyncExternalStore(subscribe, lunchStatus, () => LUNCH_SSR);

  const rows: {
    id: string;
    title: string;
    detail: string;
    code: string | null;
    status: LunchStatus;
    Icon: BoardIcon;
  }[] = [
    {
      id: "lunch25",
      title: "Lunch special",
      detail: "25% off · 1 PM to 4 PM",
      code: "lunch25",
      status: lunch,
      Icon: SunMedium,
    },
    {
      id: "deliver20",
      title: "Delivery discount",
      detail: "20% off delivery orders",
      code: "deliver20",
      status: { live: true, label: "Always on" },
      Icon: Truck,
    },
    {
      id: "tea",
      title: "Complimentary tea",
      detail: site.perks.find((p) => p.id === "complimentary-tea")?.body ?? "",
      code: null,
      status: { live: true, label: "Ask staff" },
      Icon: Coffee,
    },
    {
      id: "games",
      title: "Uno or Jenga",
      detail: site.perks.find((p) => p.id === "uno-or-jenga")?.body ?? "",
      code: null,
      status: { live: true, label: "At the table" },
      Icon: Dices,
    },
    {
      id: "insta-story",
      title: "Post an Insta story, unlock a surprise",
      detail:
        site.perks.find((p) => p.id === "insta-story")?.body ??
        "Share your Markhor experience on your Instagram story and unlock a surprise.",
      code: null,
      status: { live: true, label: "Stamp" },
      Icon: Camera,
    },
  ];

  return (
    <section className="paper-texture overflow-x-clip bg-cream">
      <div className="mx-auto grid w-full max-w-[1100px] items-start gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <Reveal>
          <SectionEyebrow>Today&apos;s board</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight text-ink uppercase sm:text-5xl">
            Offers that hit the spot.
          </h2>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-muted sm:text-base">
            Copy a code at the board, then apply it in your cart before
            checkout. Lunch window is Asia/Karachi time.
          </p>
          <ul className="mt-6 flex flex-wrap gap-5 text-xs text-muted">
            <li className="inline-flex items-center gap-2">
              <StatusPulse live tone="emerald" />
              Live / available
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-line-strong" aria-hidden />
              Upcoming or ended
            </li>
          </ul>

          <OffersCoverflow />
        </Reveal>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: reduce ? 0.2 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full self-start overflow-hidden rounded-[1.75rem] border border-[#5a3d2e]/40 bg-[#1a1212] p-5 text-cream shadow-[0_24px_60px_rgba(20,13,14,0.28)] sm:rounded-[2rem] sm:p-6"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 15% 0%, rgba(94,15,29,0.45) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(232,120,48,0.12) 0%, transparent 55%)",
            }}
            aria-hidden
          />

          <div className="relative flex items-center justify-between gap-3">
            <p className="font-eyebrow text-[10px] font-semibold tracking-[0.22em] text-cream/55 uppercase">
              Markhor board
            </p>
            <span className="font-eyebrow inline-flex items-center gap-1.5 text-[9px] tracking-[0.16em] text-cream/40 uppercase">
              <StatusPulse live tone="emerald" className="scale-90" />
              Live board
            </span>
          </div>

          <ul className="relative mt-5 divide-y divide-cream/10">
            {rows.map((row, index) => {
              const Icon = row.Icon;
              return (
                <motion.li
                  key={row.id}
                  initial={reduce ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: reduce ? 0.15 : 0.45,
                    delay: reduce ? 0 : 0.12 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col gap-3 py-4 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                        row.status.live
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-cream/15 bg-cream/5 text-cream/45",
                      )}
                    >
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {row.status.live ? (
                          <StatusPulse live tone="emerald" />
                        ) : (
                          <span
                            className="size-2 shrink-0 rounded-full bg-cream/30"
                            aria-hidden
                          />
                        )}
                        <p className="font-heading text-[15px] font-semibold tracking-tight text-cream sm:text-base">
                          {row.title}
                        </p>
                      </div>
                      <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-cream/60 sm:text-[13px]">
                        {row.detail}
                      </p>
                      <p className="font-eyebrow mt-2 text-[10px] tracking-[0.16em] text-cream/40 uppercase">
                        {row.status.label}
                      </p>
                    </div>
                  </div>

                  {row.code ? (
                    <motion.button
                      type="button"
                      whileHover={reduce ? undefined : { scale: 1.03 }}
                      whileTap={reduce ? undefined : { scale: 0.97 }}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-cream/25 bg-cream/5 px-4 font-eyebrow text-[10px] font-semibold tracking-[0.14em] text-cream uppercase transition-colors duration-300 hover:border-cream/45 hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(row.code!);
                          showToast(`Copied ${row.code}`);
                        } catch {
                          showToast("Could not copy — type it in cart");
                        }
                      }}
                    >
                      <Copy className="size-3.5" aria-hidden />
                      Copy {row.code}
                    </motion.button>
                  ) : null}
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
