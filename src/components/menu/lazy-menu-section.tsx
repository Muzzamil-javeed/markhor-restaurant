"use client";

import { useEffect, useRef, useState } from "react";
import { MenuSectionFromCategory } from "@/components/menu/menu-section";
import type { Category } from "@/data/menu-types";

/** Defer below-the-fold dotted menu sections to cut Menu DOM / hydration. */
export function LazyMenuSection({
  category,
  eager = false,
}: {
  category: Category;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      { rootMargin: "320px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  if (visible) {
    return <MenuSectionFromCategory category={category} />;
  }

  return (
    <div
      ref={ref}
      id={category.id}
      className="scroll-mt-[calc(var(--header-h)+var(--chips-h,3.5rem)+0.75rem)]"
    >
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-line pb-2">
        <h2 className="font-eyebrow text-xs font-semibold text-ink uppercase">
          {category.name}
        </h2>
        <p className="text-[11px] tracking-wide text-muted uppercase">
          {category.items.length} items
        </p>
      </div>
      <div className="grid gap-2 lg:grid-cols-2" aria-hidden>
        {Array.from({ length: Math.min(category.items.length, 4) }).map(
          (_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-line/40"
            />
          ),
        )}
      </div>
    </div>
  );
}
