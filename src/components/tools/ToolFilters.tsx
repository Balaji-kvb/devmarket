"use client";

/**
 * Tool filter controls — category, platform, license, sort.
 * Interactive filter chips that update URL search params.
 */

import { useToolFilters } from "@/hooks/useToolFilters";
import { SORT_OPTIONS, categoryToSlug } from "@/lib/filter-utils";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState } from "react";

// ─── Filter Options ─────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  "DevOps",
  "IDE",
  "Security",
  "Testing",
  "Database",
  "Design",
  "Mobile",
];

const PLATFORM_OPTIONS = [
  { value: "desktop", label: "Desktop" },
  { value: "web", label: "Web" },
  { value: "cli", label: "CLI" },
];

const LICENSE_OPTIONS = [
  { value: "open-source", label: "Open Source" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

// ─── Filter Chip ────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center
        h-7 px-2.5
        text-xs font-medium
        rounded-md border
        transition-all duration-150
        whitespace-nowrap
        ${
          active
            ? "bg-accent/15 text-accent border-accent/30"
            : "bg-white/[0.03] text-text-secondary border-white/[0.06] hover:border-white/[0.12] hover:text-text-primary"
        }
      `}
      aria-pressed={active}
    >
      {label}
      {active && <X size={11} className="ml-1.5 shrink-0" aria-hidden="true" />}
    </button>
  );
}

// ─── Component ──────────────────────────────────────────────────

interface ToolFiltersProps {
  totalResults: number;
  className?: string;
}

export function ToolFilters({ totalResults, className = "" }: ToolFiltersProps) {
  const {
    filters,
    setCategory,
    setPlatform,
    setLicense,
    setSort,
    clearAll,
    activeFilterCount,
  } = useToolFilters();

  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className={className}>
      {/* ── Toolbar: results count + sort + toggle ───────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="text-xs text-text-muted">
            <span className="text-text-primary font-semibold">{totalResults}</span>{" "}
            {totalResults === 1 ? "tool" : "tools"} found
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="
                flex items-center gap-1
                text-[10px] text-accent hover:text-accent/80
                font-medium
                transition-colors duration-150
              "
            >
              <X size={10} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => setSort(e.target.value as typeof filters.sort)}
              className="
                appearance-none
                h-7 pl-2.5 pr-7
                bg-surface border border-white/[0.06]
                rounded-md
                text-xs text-text-secondary
                focus:outline-none focus:border-accent/40
                cursor-pointer
                transition-colors duration-150
              "
              aria-label="Sort tools"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-1.5
              h-7 px-2.5
              text-xs font-medium
              rounded-md border
              transition-all duration-150
              sm:hidden
              ${
                activeFilterCount > 0
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-white/[0.03] text-text-secondary border-white/[0.06]"
              }
            `}
            aria-expanded={showFilters}
            aria-controls="tool-filter-panel"
          >
            <SlidersHorizontal size={12} aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="
                inline-flex items-center justify-center
                w-4 h-4 rounded-full
                bg-accent text-background
                text-[9px] font-bold
              ">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Filter Chips Panel ───────────────────────────────── */}
      <div
        id="tool-filter-panel"
        className={`
          space-y-3
          ${showFilters ? "block" : "hidden sm:block"}
        `}
      >
        {/* Category */}
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5">
            Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_OPTIONS.map((cat) => {
              const slug = categoryToSlug(cat);
              return (
                <FilterChip
                  key={cat}
                  label={cat}
                  active={filters.category === slug}
                  onClick={() =>
                    setCategory(filters.category === slug ? "" : slug)
                  }
                />
              );
            })}
          </div>
        </div>

        {/* Platform + License — side by side */}
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5">
              Platform
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORM_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  active={filters.platform === opt.value}
                  onClick={() =>
                    setPlatform(filters.platform === opt.value ? "" : opt.value)
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5">
              License
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LICENSE_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  active={filters.license === opt.value}
                  onClick={() =>
                    setLicense(filters.license === opt.value ? "" : opt.value)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
