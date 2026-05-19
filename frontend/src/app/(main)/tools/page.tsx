/**
 * /tools — Tools Marketplace Page (Server Component).
 *
 * Mirrors /apis architecture: reads searchParams → filters/sorts
 * server-side → passes minimal props to presentation components.
 */

import { Suspense } from "react";
import { Wrench } from "lucide-react";
import { getAllTools } from "@/lib/data";
import {
  searchItems,
  filterItems,
  sortItems,
  slugToCategory,
  type SortKey,
  type FilterCondition,
} from "@/lib/filter-utils";
import type { ToolItem } from "@/lib/data";

import { ToolGrid } from "@/components/tools/ToolGrid";
import { ToolFilters } from "@/components/tools/ToolFilters";
import { ToolSearchBar } from "@/components/tools/ToolSearchBar";
import { ToolEmptyState } from "@/components/tools/ToolEmptyState";

// ─── Metadata ───────────────────────────────────────────────────

export const metadata = {
  title: "Tools — DevMarket",
  description:
    "Browse, search, and filter developer tools across DevOps, IDE, security, and more.",
};

// ─── Category list (for slug resolution) ────────────────────────

const ALL_CATEGORIES = [
  "DevOps",
  "IDE",
  "Security",
  "Testing",
  "Database",
  "Design",
  "Mobile",
];

// ─── Page ───────────────────────────────────────────────────────

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ── Read URL params ──────────────────────────────────────
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const categorySlug =
    typeof params.category === "string" ? params.category : "";
  const platform = typeof params.platform === "string" ? params.platform : "";
  const license = typeof params.license === "string" ? params.license : "";
  const sort = (typeof params.sort === "string" ? params.sort : "featured") as SortKey;

  // ── Load & process data ──────────────────────────────────
  let tools: ToolItem[] = getAllTools();

  // Search
  if (query) {
    tools = searchItems(tools, query, [
      "name",
      "tagline",
      "description",
      "category",
      "platform",
      "tags",
    ]);
  }

  // Filter
  const conditions: FilterCondition<ToolItem>[] = [];

  if (categorySlug) {
    const resolvedCategory = slugToCategory(categorySlug, ALL_CATEGORIES);
    if (resolvedCategory) {
      conditions.push({ field: "category", value: resolvedCategory });
    }
  }
  if (platform) {
    conditions.push({ field: "platform", value: platform });
  }
  if (license) {
    conditions.push({ field: "license", value: license });
  }

  tools = filterItems(tools, conditions);

  // Sort — ToolItem has `featured` and `name`; sortItems handles missing savedCount/createdAt
  tools = sortItems(tools, sort);

  const totalResults = tools.length;
  const hasFilters = !!(categorySlug || platform || license);
  const hasSearch = !!query;

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="page-container animate-fade-in">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="
          w-9 h-9 rounded-lg shrink-0
          bg-accent-2/10 border border-accent-2/20
          flex items-center justify-center
        ">
          <Wrench size={16} className="text-accent-2" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Tools
          </h1>
          <p className="text-xs text-text-muted">
            Browse and discover developer tools
          </p>
        </div>
      </div>

      {/* ── Search + Filters ────────────────────────────────── */}
      <div className="mt-6 mb-5">
        <Suspense fallback={null}>
          <ToolSearchBar className="mb-4" />
        </Suspense>
        <Suspense fallback={null}>
          <ToolFilters totalResults={totalResults} />
        </Suspense>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06] mb-6" />

      {/* ── Results ─────────────────────────────────────────── */}
      {totalResults > 0 ? (
        <ToolGrid tools={tools} />
      ) : (
        <Suspense fallback={null}>
          <ToolEmptyState hasFilters={hasFilters} hasSearch={hasSearch} />
        </Suspense>
      )}
    </div>
  );
}
