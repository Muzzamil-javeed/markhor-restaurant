import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HomeSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function HomeSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
}: HomeSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn("py-14 sm:py-16", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1100px] px-4",
          containerClassName,
        )}
      >
        <div className="mb-8 max-w-2xl">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={id ? `${id}-title` : undefined}
            className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm text-muted sm:text-base">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
