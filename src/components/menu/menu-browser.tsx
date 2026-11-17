"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { CategoryChips } from "@/components/menu/category-chips";
import { MenuCatalog } from "@/components/menu/menu-catalog";
import { MenuSearchFilters } from "@/components/menu/menu-search-filters";
import { menu } from "@/data/menu";
import { site } from "@/data/site";
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

export function MenuBrowser() {
  const hash = useSyncExternalStore(subscribeHash, getHash, () => null);
  const [filters, setFilters] = useState<MenuFilters>(emptyFilters);
  const [activeId, setActiveId] = useState<string | null>(menu[0]?.id ?? null);
  const scrollingToRef = useRef<string | null>(null);
  const appliedHashRef = useRef<string | null>(null);
  const deferredFilters = useDeferredValue(filters);
  const isFiltering = deferredFilters !== filters;

  const visible = useMemo(() => filterMenu(menu, filters), [filters]);
  const totalVisible = countVisibleItems(visible);
  const filteringActive =
    Boolean(filters.query.trim()) ||
    filters.spicy ||
    filters.smoked ||
    filters.under1000;

  useEffect(() => {
    if (!hash) return;
    if (!menu.some((category) => category.id === hash)) return;
    if (appliedHashRef.current === hash) return;
    appliedHashRef.current = hash;
    scrollingToRef.current = hash;
    queueMicrotask(() => {
      setActiveId(hash);
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        if (scrollingToRef.current === hash) scrollingToRef.current = null;
      }, 700);
    });
  }, [hash]);

  useEffect(() => {
    if (visible.length === 0) return;

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
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        const top = visibleEntries[0];
        if (top?.target.id) {
          setActiveId(top.target.id);
        }
      },
      {
        root: null,
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0.05, 0.2, 0.4],
      },
    );

    for (const category of visible) {
      const node = document.getElementById(category.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [visible]);

  const selectCategory = useCallback((categoryId: string) => {
    scrollingToRef.current = categoryId;
    appliedHashRef.current = categoryId;
    setActiveId(categoryId);
    document
      .getElementById(categoryId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${categoryId}`);
    window.setTimeout(() => {
      if (scrollingToRef.current === categoryId) {
        scrollingToRef.current = null;
      }
    }, 700);
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-6 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Menu</h1>
        <p className="mt-2 text-sm text-muted">{site.footer.note}</p>
        <div className="mt-5">
          <MenuSearchFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      <CategoryChips
        categories={visible}
        activeId={
          activeId && visible.some((category) => category.id === activeId)
            ? activeId
            : (visible[0]?.id ?? null)
        }
        onSelect={selectCategory}
      />

      <div
        className={`mx-auto w-full max-w-[1100px] px-4 pt-6 pb-16 transition-opacity ${isFiltering ? "opacity-70" : "opacity-100"}`}
      >
        {totalVisible === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-ink">No dishes match</p>
            <p className="mt-2 text-sm text-muted">
              Try another search or clear the Spicy, Smoked, or Under Rs. 1,000
              filters.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex h-10 items-center rounded-xl border border-line px-4 text-sm font-medium text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              onClick={() => setFilters(emptyFilters)}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <MenuCatalog
            categories={visible}
            eagerCount={filteringActive ? visible.length : 1}
          />
        )}
      </div>
    </>
  );
}
