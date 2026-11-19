"use client";

import { cn } from "@/lib/cn";

type Beat =
  | { kind: "loud"; text: string }
  | { kind: "soft"; text: string }
  | { kind: "mark" };

const BEATS: Beat[] = [
  { kind: "loud", text: "Smoked low & slow" },
  { kind: "mark" },
  { kind: "soft", text: "Markhor" },
  { kind: "mark" },
  { kind: "loud", text: "DHA Phase 6" },
  { kind: "mark" },
  { kind: "loud", text: "Lunch 25% off" },
  { kind: "mark" },
  { kind: "soft", text: "Always fire" },
  { kind: "mark" },
  { kind: "loud", text: "Brisket · Burgers · Steaks" },
  { kind: "mark" },
  { kind: "loud", text: "Open daily 12:30 PM" },
  { kind: "mark" },
  { kind: "soft", text: "Deliver20" },
  { kind: "mark" },
  { kind: "loud", text: "Western smokehouse" },
  { kind: "mark" },
];

function StarMark() {
  return (
    <span
      className="mx-1.5 inline-flex size-3 shrink-0 rotate-45 bg-cream/90 sm:mx-2 sm:size-3.5"
      aria-hidden
    />
  );
}

function BeatRow({ beats }: { beats: Beat[] }) {
  return (
    <div className="flex items-center gap-5 px-4 sm:gap-7 sm:px-6">
      {beats.map((beat, index) => {
        if (beat.kind === "mark") {
          return <StarMark key={`mark-${index}`} />;
        }
        if (beat.kind === "soft") {
          return (
            <span
              key={`soft-${beat.text}-${index}`}
              className="font-heading shrink-0 text-[1.35rem] font-semibold tracking-tight text-cream italic sm:text-[1.75rem] md:text-[2rem]"
            >
              {beat.text}
            </span>
          );
        }
        return (
          <span
            key={`loud-${beat.text}-${index}`}
            className="font-display shrink-0 text-[1.35rem] font-bold tracking-[0.04em] text-cream uppercase sm:text-[1.75rem] md:text-[2rem]"
          >
            {beat.text}
          </span>
        );
      })}
    </div>
  );
}

/** Single maroon ribbon, centered on cream → black cut. */
export function HomeMarqueeRibbon() {
  const half = [...BEATS, ...BEATS];

  return (
    <div className="relative isolate z-10 overflow-x-clip pt-12 pb-12 sm:pt-14 sm:pb-14">
      {/* 50% cream above / 50% popular black below — strip sits on the cut */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, #ebe3de 0%, #ebe3de 50%, #120D0E 50%, #120D0E 100%)",
        }}
      />

      <div
        className={cn(
          "relative left-1/2 w-[125%] max-w-none -translate-x-1/2",
          "origin-center -rotate-[3.5deg] sm:w-[120%] sm:-rotate-[2.75deg]",
        )}
      >
        <div
          className={cn(
            "w-full overflow-hidden bg-brand",
            "shadow-[0_16px_36px_rgba(94,15,29,0.28)]",
            "py-5 sm:py-6 md:py-7",
          )}
        >
          <div className="animate-marquee-ribbon flex w-max items-center whitespace-nowrap will-change-transform">
            <BeatRow beats={half} />
            <BeatRow beats={half} />
          </div>
        </div>
      </div>

      <span className="sr-only">
        Markhor smokehouse in DHA Phase 6. Smoked low and slow. Lunch 25% off.
        Open daily from 12:30 PM. Delivery code deliver20.
      </span>
    </div>
  );
}
