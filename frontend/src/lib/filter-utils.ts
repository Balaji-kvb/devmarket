/**
 * Generic filtering, sorting, and searching utilities.
 *
 * Designed to be reusable across APIs, Tools, and News pages.
 * All functions are pure — no side effects, no component coupling.
 */

// ─── Search ─────────────────────────────────────────────────────

/**
 * Search items by matching a query against specified string fields.
 * Case-insensitive, trimmed, supports array fields (tags).
 */
export function searchItems<T extends object>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (typeof value === "string") {
        return value.toLowerCase().includes(q);
      }
      if (Array.isArray(value)) {
        return value.some(
          (v) => typeof v === "string" && v.toLowerCase().includes(q)
        );
      }
      return false;
    })
  );
}

// ─── Filtering ──────────────────────────────────────────────────

/** A single filter condition: field name + expected value. */
export interface FilterCondition<T extends object> {
  field: keyof T;
  value: string;
}

/**
 * Filter items by multiple conditions (AND logic).
 * Each condition checks if the field value matches (case-insensitive).
 * Supports string and array fields.
 */
export function filterItems<T extends object>(
  items: T[],
  conditions: FilterCondition<T>[]
): T[] {
  if (conditions.length === 0) return items;

  return items.filter((item) =>
    conditions.every(({ field, value }) => {
      const fieldValue = item[field];
      const target = value.toLowerCase();

      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase() === target;
      }
      if (typeof fieldValue === "boolean") {
        return String(fieldValue) === target;
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(
          (v) => typeof v === "string" && v.toLowerCase() === target
        );
      }
      return false;
    })
  );
}

// ─── Sorting ────────────────────────────────────────────────────

/** Supported sort keys — extensible for future pages. */
export type SortKey = "featured" | "popular" | "newest" | "alpha";

export interface SortOption {
  key: SortKey;
  label: string;
}

/** Standard sort options used across pages. */
export const SORT_OPTIONS: SortOption[] = [
  { key: "featured", label: "Featured" },
  { key: "popular", label: "Most Popular" },
  { key: "newest", label: "Recently Added" },
  { key: "alpha", label: "Alphabetical" },
];

/**
 * Sort items by the specified key.
 * Requires items to have optional `featured`, `savedCount`,
 * `createdAt`, and `name` fields.
 */
export function sortItems<
  T extends {
    featured?: boolean;
    savedCount?: number;
    createdAt?: string;
    name: string;
  }
>(items: T[], sortKey: SortKey): T[] {
  const sorted = [...items];

  switch (sortKey) {
    case "featured":
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.savedCount ?? 0) - (a.savedCount ?? 0);
      });

    case "popular":
      return sorted.sort(
        (a, b) => (b.savedCount ?? 0) - (a.savedCount ?? 0)
      );

    case "newest":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

    case "alpha":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return sorted;
  }
}

// ─── URL Param Helpers ──────────────────────────────────────────

/**
 * Normalize a category string to a URL-safe slug.
 * "AI & ML" → "ai-ml", "Maps & Geo" → "maps-geo"
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Reverse: URL slug back to display category.
 * "ai-ml" → "AI & ML" (from a lookup map).
 */
export function slugToCategory(
  slug: string,
  categories: string[]
): string | undefined {
  return categories.find((cat) => categoryToSlug(cat) === slug);
}

// ─── Pagination ─────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Paginate an array of items.
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
    hasMore: safePage < totalPages,
  };
}
