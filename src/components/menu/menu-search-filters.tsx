"use client";

import { Search } from "lucide-react";
import type { MenuFilters } from "@/lib/menu";
import { cn } from "@/lib/cn";

type MenuSearchFiltersProps = {
  filters: MenuFilters;
  onChange: (next: MenuFilters) => void;
};

const toggles = [
  { key: "spicy", label: "Spicy" },
  { key: "smoked", label: "Smoked" },
  { key: "under1000", label: "Under Rs. 1,000" },
] as const;

export function MenuSearchFilters({
  filters,
  onChange,
}: MenuSearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="relative block">
        <span className="sr-only">Search the menu</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          placeholder="Search dishes"
          className="h-11 w-full rounded-2xl border border-line bg-white pr-3 pl-10 text-sm text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-brand/40"
        />
      </label>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
        {toggles.map((toggle) => {
          const active = filters[toggle.key];
          return (
            <button
              key={toggle.key}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange({ ...filters, [toggle.key]: !filters[toggle.key] })
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                active
                  ? "border-brand bg-tint text-brand"
                  : "border-line bg-white text-ink hover:bg-tint/40",
              )}
            >
              {toggle.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
