"use client";

/**
 * Client hook for managing API filter state via URL search params.
 *
 * All state lives in the URL — no React state for data filtering.
 * Uses Next.js useRouter + useSearchParams for URL manipulation.
 */

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SortKey } from "@/lib/filter-utils";

// ─── Types ──────────────────────────────────────────────────────

export interface APIFilterState {
  query: string;
  category: string;
  pricing: string;
  auth: string;
  sort: SortKey;
}

// ─── Hook ───────────────────────────────────────────────────────

export function useAPIFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current state from URL
  const filters: APIFilterState = {
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    pricing: searchParams.get("pricing") ?? "",
    auth: searchParams.get("auth") ?? "",
    sort: (searchParams.get("sort") as SortKey) ?? "featured",
  };

  // Build new URL with updated params
  const updateParams = useCallback(
    (updates: Partial<Record<string, string>>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  // Convenience setters
  const setQuery = useCallback(
    (q: string) => updateParams({ q: q || "" }),
    [updateParams]
  );

  const setCategory = useCallback(
    (category: string) => updateParams({ category: category || "" }),
    [updateParams]
  );

  const setPricing = useCallback(
    (pricing: string) => updateParams({ pricing: pricing || "" }),
    [updateParams]
  );

  const setAuth = useCallback(
    (auth: string) => updateParams({ auth: auth || "" }),
    [updateParams]
  );

  const setSort = useCallback(
    (sort: SortKey) => updateParams({ sort }),
    [updateParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeFilterCount = [
    filters.category,
    filters.pricing,
    filters.auth,
  ].filter(Boolean).length;

  return {
    filters,
    setQuery,
    setCategory,
    setPricing,
    setAuth,
    setSort,
    clearAll,
    updateParams,
    activeFilterCount,
  };
}
