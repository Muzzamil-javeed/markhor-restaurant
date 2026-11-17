"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Category } from "@/data/menu-types";
import { cn } from "@/lib/cn";

type CategoryChipsProps = {
  categories: Category[];
  activeId: string | null;
  onSelect: (categoryId: string) => void;
};

export function CategoryChips({
  categories,
  activeId,
  onSelect,
}: CategoryChipsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const max = Math.max(0, node.scrollWidth - node.clientWidth);
    const left = node.scrollLeft;
    setCanLeft(left > 2);
    setCanRight(max > 2 && left < max - 2);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const apply = () => {
      const height = Math.ceil(root.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--chips-h", `${height}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(root);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--chips-h");
    };
  }, []);

  useLayoutEffect(() => {
    updateArrows();
  }, [categories, updateArrows]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    updateArrows();
    const onScroll = () => updateArrows();
    node.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(() => updateArrows());
    observer.observe(node);
    window.addEventListener("resize", updateArrows);
    return () => {
      node.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [categories, updateArrows]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = activeRef.current;
    if (!scroller || !chip) return;
    const target =
      chip.offsetLeft - scroller.clientWidth / 2 + chip.offsetWidth / 2;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    scroller.scrollTo({
      left: Math.min(max, Math.max(0, target)),
      behavior: "smooth",
    });
  }, [activeId]);

  const scrollByDir = (dir: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(280, Math.floor(node.clientWidth * 0.8));
    node.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (categories.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="sticky top-[var(--header-h)] z-30 border-b border-line bg-cream"
    >
      <div className="mx-auto flex w-full max-w-[1100px] items-center gap-2 px-3 sm:px-4">
        <button
          type="button"
          aria-label="Scroll categories left"
          disabled={!canLeft}
          onClick={() => scrollByDir(-1)}
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            canLeft
              ? "opacity-100 hover:bg-tint"
              : "invisible pointer-events-none",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        <div
          ref={scrollerRef}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: "smooth" }}
          role="tablist"
          aria-label="Menu categories"
        >
          {categories.map((category) => {
            const active = category.id === activeId;
            return (
              <button
                key={category.id}
                ref={active ? activeRef : undefined}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(category.id)}
                className={cn(
                  "ui-press shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                  active
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line bg-white text-ink hover:border-brand/40 hover:bg-tint/50",
                )}
              >
                {category.name}
                <span
                  className={cn(
                    "ml-1.5",
                    active ? "text-on-brand/80" : "text-muted",
                  )}
                >
                  {category.items.length}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Scroll categories right"
          disabled={!canRight}
          onClick={() => scrollByDir(1)}
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            canRight
              ? "opacity-100 hover:bg-tint"
              : "invisible pointer-events-none",
          )}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
