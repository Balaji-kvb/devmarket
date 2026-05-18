"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Layers,
  Wrench,
  Compass,
  Newspaper,
  ArrowRight,
  Clock,
  Search,
} from "lucide-react";
import type { GroupedResults, CommandResult, ResultType } from "@/hooks/useCommandPalette";

// ─── Group Config ───────────────────────────────────────────────

const GROUP_CONFIG: Record<
  ResultType,
  { label: string; icon: typeof Layers; color: string }
> = {
  api:  { label: "APIs",       icon: Layers,    color: "text-accent" },
  tool: { label: "Tools",      icon: Wrench,    color: "text-emerald-400" },
  news: { label: "News",       icon: Newspaper, color: "text-success" },
  nav:  { label: "Navigation", icon: Compass,   color: "text-amber-400" },
};

// ─── Types ──────────────────────────────────────────────────────

interface CommandResultsProps {
  /** Grouped search results. */
  grouped: GroupedResults;
  /** Whether there are results for the current query. */
  hasResults: boolean;
  /** Current debounced query (for empty-state messaging). */
  debouncedQuery: string;
  /** Raw query string. */
  query: string;
  /** Recent search terms. */
  recentSearches: string[];
  /** Called when a result is selected. */
  onSelect: (url: string, title: string) => void;
  /** Called when a recent search is replayed. */
  onReplayRecent: (term: string) => void;
  /** Called when recent searches are cleared. */
  onClearRecent: () => void;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Command palette results list with keyboard navigation.
 *
 * Features:
 * - Grouped sections (APIs, Tools, Navigation)
 * - Arrow key navigation with active highlighting
 * - Enter to select
 * - Recent searches when query is empty
 * - Empty state
 */
export function CommandResults({
  grouped,
  hasResults,
  debouncedQuery,
  query,
  recentSearches,
  onSelect,
  onReplayRecent,
  onClearRecent,
}: CommandResultsProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Build flat list for keyboard navigation ───────────────
  const flatResults: CommandResult[] = [];
  const groupOrder: ResultType[] = ["api", "tool", "news", "nav"];

  for (const type of groupOrder) {
    const items = grouped[type];
    if (items.length > 0) {
      flatResults.push(...items);
    }
  }

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(flatResults.length > 0 ? 0 : -1);
  }, [debouncedQuery, flatResults.length]);

  // ── Keyboard navigation ───────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (flatResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : flatResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < flatResults.length) {
            const item = flatResults[activeIndex];
            onSelect(item.url, item.title);
          }
          break;
      }
    },
    [flatResults, activeIndex, onSelect]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Scroll active item into view ──────────────────────────
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const activeElement = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    );
    activeElement?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ── Render states ─────────────────────────────────────────
  const showRecent = !query.trim() && recentSearches.length > 0;
  const showEmpty = debouncedQuery.trim().length > 0 && !hasResults;
  const showInitial = !query.trim() && recentSearches.length === 0;

  let flatIndex = -1;

  return (
    <div
      ref={listRef}
      id="command-results"
      role="listbox"
      aria-label="Search results"
      className="max-h-[min(50vh,400px)] overflow-y-auto no-scrollbar py-2"
    >
      {/* ── Recent searches ──────────────────────────────────── */}
      {showRecent && (
        <div role="group" aria-label="Recent searches">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Recent
            </span>
            <button
              onClick={onClearRecent}
              className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Clear recent searches"
            >
              Clear
            </button>
          </div>
          {recentSearches.map((term) => (
            <button
              key={`recent-${term}`}
              onClick={() => onReplayRecent(term)}
              className="command-item w-full text-left"
            >
              <Clock size={14} className="text-text-muted shrink-0" aria-hidden="true" />
              <span className="flex-1 text-sm text-text-secondary truncate">
                {term}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Grouped results ──────────────────────────────────── */}
      {groupOrder.map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;

        const config = GROUP_CONFIG[type];
        const GroupIcon = config.icon;

        return (
          <div key={type} role="group" aria-label={config.label}>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <GroupIcon size={12} className={config.color} aria-hidden="true" />
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                {config.label}
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                {items.length}
              </span>
            </div>

            {items.map((item) => {
              flatIndex++;
              const isActive = flatIndex === activeIndex;
              const currentIndex = flatIndex;

              return (
                <button
                  key={item.id}
                  data-index={currentIndex}
                  onClick={() => onSelect(item.url, item.title)}
                  onMouseEnter={() => setActiveIndex(currentIndex)}
                  className={`
                    command-item w-full text-left group
                    ${isActive ? "command-item-active" : ""}
                  `}
                  role="option"
                  aria-selected={isActive}
                >
                  {/* Avatar */}
                  <div className={`
                    w-7 h-7 rounded-md shrink-0
                    flex items-center justify-center
                    text-[11px] font-bold
                    ${type === "api"
                      ? "bg-accent/10 text-accent"
                      : type === "tool"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }
                  `}>
                    {item.title.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text-primary font-medium">
                      {item.title}
                    </span>
                    <span className="text-xs text-text-muted ml-2 truncate">
                      {item.subtitle}
                    </span>
                  </div>

                  {/* Category badge */}
                  <span className="
                    hidden sm:inline-block
                    text-[9px] text-text-muted
                    bg-white/[0.04] border border-white/[0.06]
                    rounded px-1.5 py-0.5
                    font-mono uppercase tracking-wider
                    shrink-0
                  ">
                    {item.category}
                  </span>

                  {/* Arrow indicator */}
                  <ArrowRight
                    size={12}
                    className={`
                      text-text-muted shrink-0 transition-opacity
                      ${isActive ? "opacity-100" : "opacity-0"}
                    `}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        );
      })}

      {/* ── Empty state ──────────────────────────────────────── */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Search size={24} className="text-text-muted mb-3" aria-hidden="true" />
          <p className="text-sm text-text-secondary mb-1">
            No results for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <p className="text-xs text-text-muted">
            Try a different search term or browse the marketplace
          </p>
        </div>
      )}

      {/* ── Initial state ────────────────────────────────────── */}
      {showInitial && (
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <p className="text-sm text-text-muted mb-1">
            Start typing to search
          </p>
          <p className="text-xs text-text-muted">
            APIs, tools, and navigation
          </p>
        </div>
      )}
    </div>
  );
}
