"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PopularPickCard } from "@/components/home/popular-pick-card";
import { Reveal } from "@/components/ui/reveal";
import { popularPicks } from "@/data/popular";
import { site } from "@/data/site";

export function HomePopularPicks() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate z-0 overflow-hidden bg-[#120D0E] pt-0 text-[#F6F4F2]">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(94,15,29,0.18),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(232,120,48,0.06),transparent_45%)]" />

        {/* Right burger — ~50% visible */}
        <motion.div
          className="pointer-events-none absolute top-[6%] right-0 hidden h-[min(72vw,30rem)] w-[min(72vw,30rem)] translate-x-1/2 opacity-[0.48] lg:block"
          animate={reduce ? undefined : { y: [0, -16, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/home/popular-burger.webp"
            alt=""
            fill
            className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
            sizes="480px"
          />
        </motion.div>

        {/* Left fries — ~50% visible + slow 360° */}
        <motion.div
          className="absolute bottom-[16%] left-0 hidden h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 opacity-[0.48] sm:block sm:bottom-[18%]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{
            duration: 58,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src="/images/home/popular-fries.webp"
            alt=""
            fill
            className="object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.4)]"
            sizes="(max-width: 768px) 70vw, 450px"
          />
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-[1100px] px-4 pt-16 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-12">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display mt-3 text-3xl leading-[0.95] tracking-wide text-[#F6F4F2] uppercase sm:text-5xl">
                Popular picks
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#F6F4F2]/50">
                Smokehouse signatures from the board — bold plates, one-tap
                add, Markhor heat.
              </p>
            </div>

            <Link
              href="/menu#cold-beverages"
              className="group inline-flex max-w-xs items-center justify-center rounded-2xl border border-white/25 bg-white px-5 py-3 text-center shadow-[0_0_28px_rgba(255,255,255,0.12)] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span className="font-display text-[11px] leading-snug tracking-[0.06em] text-[#140D0E] uppercase sm:text-xs">
                Make it a combo
                <span className="mt-0.5 block text-[10px] tracking-[0.14em] text-[#140D0E]/70">
                  Soft drink from the board
                </span>
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Mobile-only smooth snap slider */}
        <ul
          className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-3 sm:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Popular picks"
        >
          {popularPicks.map((item, index) => (
            <PopularPickCard
              key={`m-${item.id}`}
              item={item}
              index={index}
              className="w-[82%] max-w-[22rem] shrink-0 snap-center"
            />
          ))}
        </ul>

        {/* Tablet / desktop grid */}
        <ul className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {popularPicks.map((item, index) => (
            <PopularPickCard key={item.id} item={item} index={index} />
          ))}
        </ul>

        <p className="mt-8 mb-2 text-center text-[11px] text-[#F6F4F2]/35">
          {site.footer.note}
        </p>
      </div>
    </section>
  );
}
