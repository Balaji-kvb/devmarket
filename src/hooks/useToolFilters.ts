"use client";

/**
 * Client hook for managing Tool filter state via URL search params.
 *
 * Mirrors useAPIFilters — same URL-driven pattern,
 * with tool-specific params (platform, license).
 */

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SortKey } from "@/lib/filter-utils";

// ─── Types ──────────────────────────────────────────────────────

export interface ToolFilterState {
  query: string;
  category: string;
  platform: string;
  license: string;
  sort: SortKey;
}

// ─── Hook ───────────────────────────────────────────────────────

export function useToolFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current state from URL
  const filters: ToolFilterState = {
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    platform: searchParams.get("platform") ?? "",
    license: searchParams.get("license") ?? "",
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

  const setQuery = useCallback(
    (q: string) => updateParams({ q: q || "" }),
    [updateParams]
  );

  const setCategory = useCallback(
    (category: string) => updateParams({ category: category || "" }),
    [updateParams]
  );

  const setPlatform = useCallback(
    (platform: string) => updateParams({ platform: platform || "" }),
    [updateParams]
  );

  const setLicense = useCallback(
    (license: string) => updateParams({ license: license || "" }),
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
    filters.platform,
    filters.license,
  ].filter(Boolean).length;

  return {
    filters,
    setQuery,
    setCategory,
    setPlatform,
    setLicense,
    setSort,
    clearAll,
    updateParams,
    activeFilterCount,
  };
}
