import Image from "next/image";
import {
  ClipboardCheck,
  Search,
  SlidersHorizontal,
  Utensils,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const steps = [
  {
    n: "01",
    title: "Pick your food",
    body: "Browse the menu, search, or filter for spicy and smoked plates.",
    Icon: Search,
  },
  {
    n: "02",
    title: "Make it yours",
    body: "Choose sauce, size, and add-ons — then drop it in the cart.",
    Icon: SlidersHorizontal,
  },
  {
    n: "03",
    title: "Checkout",
    body: "Delivery, pickup, or dine-in. Apply lunch25 or deliver20 if it fits.",
    Icon: ClipboardCheck,
  },
  {
    n: "04",
    title: "Track and enjoy",
    body: "Follow your order live from the kitchen to your table or door.",
    Icon: Utensils,
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <SectionEyebrow tone="cream">How it works</SectionEyebrow>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] tracking-tight uppercase sm:text-5xl">
              Order in four easy steps.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              From the first tap to a hot plate — Markhor keeps the path short.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-cream/15 bg-ink">
              <Image
                src="/images/home/how-it-works.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-brand/20" aria-hidden />
            </div>
          </Reveal>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.Icon;
            return (
              <Reveal key={step.n} as="li" delay={0.05 * index}>
                <article className="group relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-2xl border border-cream/10 bg-[#140D0E]/60 px-5 pt-6 pb-5 transition-colors duration-300 hover:border-cream/25">
                  <span
                    className="pointer-events-none absolute top-2 left-3 font-display text-[4.75rem] leading-none font-black tracking-tight select-none sm:text-[5.25rem]"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(246,244,242,0.55)",
                    }}
                    aria-hidden
                  >
                    {step.n}
                  </span>

                  <div className="relative z-[1] mt-auto flex flex-col gap-3 pt-16">
                    <span className="inline-flex size-9 items-center justify-center rounded-full border border-cream/25 bg-cream/5 text-cream">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-semibold tracking-tight text-cream">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/65">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
