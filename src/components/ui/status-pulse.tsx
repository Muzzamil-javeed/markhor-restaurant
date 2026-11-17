import { cn } from "@/lib/cn";

type StatusPulseProps = {
  className?: string;
  /** When false, renders a static muted dot. */
  live?: boolean;
  tone?: "emerald" | "brand";
};

/** Soft pulsing live indicator — green by default. */
export function StatusPulse({
  className,
  live = true,
  tone = "emerald",
}: StatusPulseProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-2 shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      {live ? (
        <>
          <span
            className={cn(
              "absolute inset-0 rounded-full opacity-75",
              tone === "emerald"
                ? "animate-status-pulse bg-emerald-400"
                : "animate-status-pulse bg-brand",
            )}
          />
          <span
            className={cn(
              "relative size-2 rounded-full",
              tone === "emerald" ? "bg-emerald-400" : "bg-brand",
            )}
          />
        </>
      ) : (
        <span className="size-2 rounded-full bg-muted/60" />
      )}
    </span>
  );
}
