"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CategoryChips } from "@/components/menu/category-chips";
import { MenuSectionFromCategory } from "@/components/menu/menu-section";
import { MenuSearchFilters } from "@/components/menu/menu-search-filters";
import type { Category } from "@/data/menu-types";
import {
  countVisibleItems,
  filterMenu,
  type MenuFilters,
} from "@/lib/menu";

const emptyFilters: MenuFilters = {
  query: "",
  spicy: false,
  smoked: false,
  under1000: false,
};

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHash(): string | null {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || null;
}

export function MenuPageClient({
  children,
  categories,
}: {
  children: ReactNode;
  categories: Category[];
}) {
  const hash = useSyncExternalStore(subscribeHash, getHash, () => null);
  const [filters, setFilters] = useState<MenuFilters>(emptyFilters);
  const [activeId, setActiveId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const scrollingToRef = useRef<string | null>(null);
  const appliedHashRef = useRef<string | null>(null);
  const deferredFilters = useDeferredValue(filters);
  const isFiltering = deferredFilters !== filters;

  const filteringActive =
    Boolean(filters.query.trim()) ||
    filters.spicy ||
    filters.smoked ||
    filters.under1000;

  const visible = useMemo(
    () => filterMenu(categories, filters),
    [categories, filters],
  );
  const totalVisible = countVisibleItems(visible);
  const chipCategories = filteringActive ? visible : categories;

  useEffect(() => {
    if (!hash) return;
    if (!categories.some((category) => category.id === hash)) return;
    if (appliedHashRef.current === hash) return;
    appliedHashRef.current = hash;
    scrollingToRef.current = hash;
    queueMicrotask(() => {
      setActiveId(hash);
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    window.setTimeout(() => {
      if (scrollingToRef.current === hash) scrollingToRef.current = null;
    }, 700);
  }, [categories, hash]);

  useEffect(() => {
    const cats = filteringActive ? visible : categories;
    if (cats.length === 0) return;
    const styles = getComputedStyle(document.documentElement);
    const headerPx =
      Number.parseFloat(styles.getPropertyValue("--header-h")) || 56;
    const chipsPx =
      Number.parseFloat(styles.getPropertyValue("--chips-h")) || 56;
    const topOffset = Math.round(headerPx + chipsPx);
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingToRef.current) return;
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visibleEntries[0];
        if (top?.target.id) setActiveId(top.target.id);
      },
      {
        root: null,
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0.05, 0.2, 0.4],
      },
    );
    for (const category of cats) {
      const node = document.getElementById(category.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [categories, filteringActive, visible]);

  const selectCategory = useCallback((categoryId: string) => {
    scrollingToRef.current = categoryId;
    appliedHashRef.current = categoryId;
    setActiveId(categoryId);
    document
      .getElementById(categoryId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${categoryId}`);
    window.setTimeout(() => {
      if (scrollingToRef.current === categoryId) scrollingToRef.current = null;
    }, 700);
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-[1100px] px-4 pb-4">
        <MenuSearchFilters filters={filters} onChange={setFilters} />
      </div>

      <CategoryChips
        categories={chipCategories}
        activeId={
          activeId && chipCategories.some((c) => c.id === activeId)
            ? activeId
            : (chipCategories[0]?.id ?? null)
        }
        onSelect={selectCategory}
      />

      <div
        className={`mx-auto w-full max-w-[1100px] px-4 pt-6 pb-16 transition-opacity ${isFiltering ? "opacity-70" : "opacity-100"}`}
      >
        {filteringActive ? (
          totalVisible === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-ink">No dishes match</p>
              <button
                type="button"
                className="mt-5 inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-medium"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {visible.map((category) => (
                <MenuSectionFromCategory
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          )
        ) : (
          children
        )}
      </div>
    </>
  );
}
