import { cn } from "@/lib/cn";

const STEPS = [
  { id: 1, label: "Order type" },
  { id: 2, label: "Details" },
  { id: 3, label: "Review" },
] as const;

export function CheckoutProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Checkout progress">
      {STEPS.map((entry) => {
        const active = entry.id === step;
        const done = entry.id < step;
        return (
          <li
            key={entry.id}
            className={cn(
              "rounded-2xl border px-3 py-3 text-center",
              active && "border-brand bg-tint text-brand",
              done && "border-brand/30 bg-white text-ink",
              !active && !done && "border-line bg-white text-muted",
            )}
            aria-current={active ? "step" : undefined}
          >
            <span className="block text-[11px] font-medium tracking-wide uppercase">
              Step {entry.id}
            </span>
            <span className="mt-0.5 block text-sm font-semibold">
              {entry.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
