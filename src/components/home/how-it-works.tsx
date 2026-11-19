"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/cn";

const steps = [
  {
    n: "01",
    title: "Pick your food",
    body: "Browse the menu, search, or filter for spicy and smoked plates.",
  },
  {
    n: "02",
    title: "Make it yours",
    body: "Choose sauce, size, and add-ons — then drop it in the cart.",
  },
  {
    n: "03",
    title: "Checkout",
    body: "Delivery, pickup, or dine-in. Apply lunch25 or deliver20 if it fits.",
  },
  {
    n: "04",
    title: "Track and enjoy",
    body: "Follow your order live from the kitchen to your table or door.",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#120D0E] pt-2 pb-16 text-[#F6F4F2] sm:pt-4 lg:pb-24">
      {/* Right décor — same cutout style as Popular picks, ~50% + float */}
      <motion.div
        className="pointer-events-none absolute top-[12%] right-0 z-0 hidden h-[min(72vw,30rem)] w-[min(72vw,30rem)] translate-x-1/2 opacity-[0.48] lg:block"
        animate={reduce ? undefined : { y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <Image
          src="/images/home/popular-burger.webp"
          alt=""
          fill
          className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
          sizes="480px"
        />
      </motion.div>

      <div className="relative z-[1] mx-auto w-full max-w-[1100px] px-4">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow tone="cream" className="justify-center text-center">
              How it works
            </SectionEyebrow>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight text-[#F6F4F2] uppercase sm:text-5xl">
              Order in four easy steps.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#F6F4F2]/65 sm:text-base">
              From the first tap to a hot plate — Markhor keeps the path short.
            </p>
          </div>
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => (
            <Reveal key={step.n} as="li" delay={0.05 * index}>
              <motion.article
                className={cn(
                  "group relative flex min-h-[15.5rem] flex-col overflow-hidden rounded-2xl",
                  "border border-white/10 bg-[#1A1314]/75 px-6 pt-7 pb-7 sm:px-7 sm:pt-8 sm:pb-8",
                  "shadow-[0_14px_32px_rgba(0,0,0,0.28)] backdrop-blur-md",
                  "transition-[border-color,box-shadow] duration-300",
                  "hover:border-white/25 hover:shadow-[0_18px_40px_rgba(0,0,0,0.4)]",
                )}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.05, ease }}
                whileHover={reduce ? undefined : { y: -5 }}
              >
                <span
                  className="pointer-events-none absolute top-3 left-5 font-display text-[4.5rem] leading-none font-black tracking-tight text-transparent select-none sm:left-6 sm:text-[5rem]"
                  style={{
                    WebkitTextStroke: "1.4px rgba(246,244,242,0.35)",
                  }}
                  aria-hidden
                >
                  {step.n}
                </span>

                <div className="relative z-[1] mt-auto flex flex-col pt-16">
                  <p className="font-eyebrow text-[9px] tracking-[0.18em] text-white/70 uppercase">
                    Step {step.n}
                  </p>
                  <h3 className="font-heading mt-2 text-base font-semibold tracking-tight text-[#F6F4F2]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#F6F4F2]/58">
                    {step.body}
                  </p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
