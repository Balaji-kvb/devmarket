"use client";

/**
 * Debounced API search bar.
 * Updates URL param `?q=` on input change after debounce.
 */

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useAPIFilters } from "@/hooks/useAPIFilters";

interface APISearchBarProps {
  className?: string;
}

export function APISearchBar({ className = "" }: APISearchBarProps) {
  const { filters, setQuery } = useAPIFilters();
  const [localValue, setLocalValue] = useState(filters.query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from URL → local on external URL changes
  useEffect(() => {
    setLocalValue(filters.query);
  }, [filters.query]);

  // Debounced URL update
  const handleChange = (value: string) => {
    setLocalValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(value);
    }, 200);
  };

  const handleClear = () => {
    setLocalValue("");
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search APIs by name, provider, or category..."
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="
          w-full h-9
          pl-9 pr-8
          bg-surface border border-white/[0.06]
          rounded-lg
          text-sm text-text-primary placeholder:text-text-muted
          focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20
          transition-colors duration-150
        "
        aria-label="Search APIs"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="
            absolute right-2.5 top-1/2 -translate-y-1/2
            p-0.5 rounded
            text-text-muted hover:text-text-primary
            transition-colors duration-150
          "
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
