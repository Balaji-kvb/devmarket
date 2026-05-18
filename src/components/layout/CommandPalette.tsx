"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Layers,
  Wrench,
  Newspaper,
  ArrowRight,
  Clock,
  X,
} from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

// ─── Constants ──────────────────────────────────────────────────

const RECENT_SEARCHES_KEY = "devmarket-recent-searches";
const MAX_RECENT_SEARCHES = 5;

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof Layers; color: string }
> = {
  api: { label: "APIs", icon: Layers, color: "text-accent" },
  tool: { label: "Tools", icon: Wrench, color: "text-accent-2" },
  news: { label: "Pages", icon: Newspaper, color: "text-success" },
};

// ─── Recent Searches (localStorage) ─────────────────────────────

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const recent = getRecentSearches().filter((s) => s !== query);
    recent.unshift(query);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT_SEARCHES))
    );
  } catch {
    // localStorage unavailable — silently fail
  }
}

function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // silently fail
  }
}

// ─── Types ──────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ──────────────────────────────────────────────────

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { groupedResults, hasResults, debouncedQuery } = useSearch(query);

  // Load recent searches on mount (SSR-safe)
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [open]);

  // Reset query when palette closes
  useEffect(() => {
    if (!open) {
      // Small delay so the closing animation isn't interrupted
      const timer = setTimeout(() => setQuery(""), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSelect = useCallback(
    (url: string, title: string) => {
      addRecentSearch(title);
      onOpenChange(false);
      router.push(url);
    },
    [onOpenChange, router]
  );

  const handleRecentClick = useCallback(
    (searchTerm: string) => {
      setQuery(searchTerm);
    },
    []
  );

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const showRecent = !query.trim() && recentSearches.length > 0;
  const showEmpty = debouncedQuery.trim().length > 0 && !hasResults;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search DevMarket"
      className="command-palette-overlay"
    >
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        className="
          fixed inset-0 z-[60]
          bg-black/60 backdrop-blur-sm
          animate-fade-in
        "
        aria-hidden="true"
      />

      {/* ── Dialog ───────────────────────────────────────────── */}
      <div
        className="
          fixed inset-0 z-[61]
          flex items-start justify-center
          pt-[min(20vh,160px)] px-4
        "
      >
        <div
          className="
            w-full max-w-[560px]
            bg-[#0f1117]/95 border border-white/[0.1]
            backdrop-blur-2xl
            rounded-xl
            shadow-2xl shadow-black/40
            overflow-hidden
            animate-fade-in-up
          "
          role="dialog"
          aria-modal="true"
          aria-label="Search DevMarket"
        >
          {/* ── Input ──────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.08]">
            <Search size={16} className="text-text-muted shrink-0" aria-hidden="true" />
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Search APIs, tools, and more…"
              className="
                flex-1
                bg-transparent border-none outline-none
                text-sm text-text-primary
                placeholder:text-text-muted
                font-normal
              "
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="
                  flex items-center justify-center
                  w-5 h-5 rounded
                  text-text-muted hover:text-text-secondary
                  transition-colors duration-150
                "
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* ── Results list ────────────────────────────────── */}
          <Command.List
            className="
              max-h-[min(50vh,400px)] overflow-y-auto
              no-scrollbar
              py-2
            "
          >
            {/* Recent searches */}
            {showRecent && (
              <Command.Group
                heading={
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      Recent
                    </span>
                    <button
                      onClick={handleClearRecent}
                      className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
                      aria-label="Clear recent searches"
                    >
                      Clear
                    </button>
                  </div>
                }
              >
                {recentSearches.map((term) => (
                  <Command.Item
                    key={`recent-${term}`}
                    value={`recent-${term}`}
                    onSelect={() => handleRecentClick(term)}
                    className="command-item"
                  >
                    <Clock size={14} className="text-text-muted shrink-0" aria-hidden="true" />
                    <span className="flex-1 text-sm text-text-secondary truncate">
                      {term}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Grouped search results */}
            {Object.entries(groupedResults).map(([type, items]) => {
              const config = TYPE_CONFIG[type];
              if (!config || items.length === 0) return null;
              const GroupIcon = config.icon;

              return (
                <Command.Group
                  key={type}
                  heading={
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <GroupIcon size={12} className={config.color} aria-hidden="true" />
                      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                        {config.label}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">
                        {items.length}
                      </span>
                    </div>
                  }
                >
                  {items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.title} ${item.subtitle}`}
                      onSelect={() => handleSelect(item.url, item.title)}
                      className="command-item"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-text-primary font-medium">
                          {item.title}
                        </span>
                        <span className="text-xs text-text-muted ml-2">
                          {item.subtitle}
                        </span>
                      </div>
                      <ArrowRight
                        size={12}
                        className="text-text-muted opacity-0 group-data-[selected=true]:opacity-100 transition-opacity shrink-0"
                        aria-hidden="true"
                      />
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}

            {/* Empty state */}
            {showEmpty && (
              <Command.Empty className="flex flex-col items-center justify-center py-12 px-4">
                <Search size={24} className="text-text-muted mb-3" aria-hidden="true" />
                <p className="text-sm text-text-secondary mb-1">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="text-xs text-text-muted">
                  Try a different search term or browse the marketplace
                </p>
              </Command.Empty>
            )}

            {/* Initial state (no query, no recent) */}
            {!query.trim() && recentSearches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <p className="text-sm text-text-muted mb-1">
                  Start typing to search
                </p>
                <p className="text-xs text-text-muted">
                  APIs, tools, news, and navigation
                </p>
              </div>
            )}
          </Command.List>

          {/* ── Footer with keyboard hints ──────────────────── */}
          <div className="flex items-center gap-4 px-4 h-9 border-t border-white/[0.08]">
            <FooterHint keys={["↑", "↓"]} label="Navigate" />
            <FooterHint keys={["↵"]} label="Select" />
            <FooterHint keys={["Esc"]} label="Close" />
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

// ─── Footer Hint ────────────────────────────────────────────────

function FooterHint({
  keys,
  label,
}: {
  keys: string[];
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="
            inline-flex items-center justify-center
            min-w-[20px] h-5 px-1
            bg-white/[0.06] border border-white/[0.08]
            rounded text-[10px] font-mono text-text-muted
            leading-none
          "
        >
          {key}
        </kbd>
      ))}
      <span className="text-[11px] text-text-muted">{label}</span>
    </div>
  );
}
