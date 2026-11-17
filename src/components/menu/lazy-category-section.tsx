"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  id: string;
  titleId: string;
  name: string;
  itemCount: number;
  /** Eager-mount the first categories (above the fold). */
  eager?: boolean;
  children: ReactNode;
};

/**
 * Keeps heading/count in the DOM for a11y + deep links, but defers heavy
 * card grids until near the viewport (cuts Menu DOM / hydration cost).
 */
export function LazyCategorySection({
  id,
  titleId,
  name,
  itemCount,
  eager = false,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      className="scroll-mt-[calc(var(--header-h)+var(--chips-h,3.5rem)+0.75rem)]"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-line pb-2">
        <h2
          id={titleId}
          className="font-heading text-xl font-semibold text-ink"
        >
          {name}
        </h2>
        <p className="text-sm text-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>
      {visible ? (
        children
      ) : (
        <div
          className="grid min-h-[28rem] gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-hidden
        >
          {Array.from({ length: Math.min(itemCount, 3) }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-line bg-white"
            >
              <div className="aspect-[5/3] bg-line/50" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-2/3 rounded bg-line/60" />
                <div className="h-3 w-full rounded bg-line/40" />
                <div className="h-10 rounded-xl bg-line/50" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
