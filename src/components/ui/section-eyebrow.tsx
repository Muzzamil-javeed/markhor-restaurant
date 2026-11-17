import { cn } from "@/lib/cn";

export function SectionEyebrow({
  children,
  className,
  tone = "brand",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "cream" | "muted";
}) {
  const tones = {
    brand: "text-brand",
    cream: "text-cream/80",
    muted: "text-muted",
  } as const;

  return (
    <p
      className={cn(
        "font-eyebrow text-[11px] font-semibold uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
