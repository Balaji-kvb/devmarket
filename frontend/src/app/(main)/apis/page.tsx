/**
 * /apis — API Marketplace Page (Server Component).
 *
 * Reads URL searchParams, filters/sorts data server-side,
 * then passes minimal props to presentation components.
 */

import { Suspense } from "react";
import { Layers } from "lucide-react";
import { getAllAPIs } from "@/lib/data";
import {
  searchItems,
  filterItems,
  sortItems,
  slugToCategory,
  categoryToSlug,
  type SortKey,
  type FilterCondition,
} from "@/lib/filter-utils";
import type { APIItem } from "@/lib/data";

import { APIGrid } from "@/components/apis/APIGrid";
import { APIFilters } from "@/components/apis/APIFilters";
import { APISearchBar } from "@/components/apis/APISearchBar";
import { APIEmptyState } from "@/components/apis/APIEmptyState";

// ─── Metadata ───────────────────────────────────────────────────

export const metadata = {
  title: "APIs — DevMarket",
  description:
    "Browse, search, and filter developer APIs across AI, finance, weather, and more.",
};

// ─── Category list (for slug resolution) ────────────────────────

const ALL_CATEGORIES = [
  "AI & ML",
  "Weather",
  "Finance",
  "Developer Tools",
  "Entertainment",
  "Communication",
  "Media",
  "Maps & Geo",
  "Government",
  "Social",
];

// ─── Page ───────────────────────────────────────────────────────

export default async function APIsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ── Read URL params ──────────────────────────────────────
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const categorySlug =
    typeof params.category === "string" ? params.category : "";
  const pricing = typeof params.pricing === "string" ? params.pricing : "";
  const auth = typeof params.auth === "string" ? params.auth : "";
  const sort = (typeof params.sort === "string" ? params.sort : "featured") as SortKey;

  // ── Load & process data ──────────────────────────────────
  let apis: APIItem[] = getAllAPIs();

  // Search
  if (query) {
    apis = searchItems(apis, query, [
      "name",
      "provider",
      "tagline",
      "description",
      "category",
      "tags",
    ]);
  }

  // Filter
  const conditions: FilterCondition<APIItem>[] = [];

  if (categorySlug) {
    const resolvedCategory = slugToCategory(categorySlug, ALL_CATEGORIES);
    if (resolvedCategory) {
      conditions.push({ field: "category", value: resolvedCategory });
    }
  }
  if (pricing) {
    conditions.push({ field: "pricing", value: pricing });
  }
  if (auth) {
    conditions.push({ field: "authMethod", value: auth });
  }

  apis = filterItems(apis, conditions);

  // Sort
  apis = sortItems(apis, sort);

  const totalResults = apis.length;
  const hasFilters = !!(categorySlug || pricing || auth);
  const hasSearch = !!query;

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="page-container animate-fade-in">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="
          w-9 h-9 rounded-lg shrink-0
          bg-accent/10 border border-accent/20
          flex items-center justify-center
        ">
          <Layers size={16} className="text-accent" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            APIs
          </h1>
          <p className="text-xs text-text-muted">
            Browse and discover developer APIs
          </p>
        </div>
      </div>

      {/* ── Search + Filters ────────────────────────────────── */}
      <div className="mt-6 mb-5">
        <Suspense fallback={null}>
          <APISearchBar className="mb-4" />
        </Suspense>
        <Suspense fallback={null}>
          <APIFilters totalResults={totalResults} />
        </Suspense>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06] mb-6" />

      {/* ── Results ─────────────────────────────────────────── */}
      {totalResults > 0 ? (
        <APIGrid apis={apis} />
      ) : (
        <Suspense fallback={null}>
          <APIEmptyState hasFilters={hasFilters} hasSearch={hasSearch} />
        </Suspense>
      )}
    </div>
  );
}
