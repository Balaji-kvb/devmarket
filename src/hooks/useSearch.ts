import { useMemo } from "react";
import type { SearchResult } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Search Data Source ─────────────────────────────────────────

/**
 * Searchable item shape — the data source contract.
 * Any future data source (API, database) must provide items
 * conforming to this interface.
 */
export interface SearchableItem {
  id: string;
  type: "api" | "tool" | "news";
  title: string;
  subtitle: string;
  slug: string;
  tags?: string[];
}

/**
 * Preview dataset for Phase 4.
 * Replaced with real seed data imports in Phase 5+.
 * Kept here as a fallback when seed data isn't loaded.
 */
const PREVIEW_ITEMS: SearchableItem[] = [
  // APIs
  { id: "api-1", type: "api", title: "OpenWeatherMap", subtitle: "Weather & forecast data", slug: "openweathermap", tags: ["weather", "forecast"] },
  { id: "api-2", type: "api", title: "OpenAI GPT-4", subtitle: "AI text generation", slug: "openai-gpt4", tags: ["ai", "ml", "text"] },
  { id: "api-3", type: "api", title: "GitHub REST API", subtitle: "Repository data", slug: "github-rest-api", tags: ["github", "developer"] },
  { id: "api-4", type: "api", title: "Stripe", subtitle: "Payment processing", slug: "stripe", tags: ["payments", "finance"] },
  { id: "api-5", type: "api", title: "Spotify Web API", subtitle: "Music data", slug: "spotify-web-api", tags: ["music", "media"] },
  // Tools
  { id: "tool-1", type: "tool", title: "Docker", subtitle: "Container platform", slug: "docker", tags: ["devops", "containers"] },
  { id: "tool-2", type: "tool", title: "VS Code", subtitle: "Code editor", slug: "vs-code", tags: ["ide", "editor"] },
  { id: "tool-3", type: "tool", title: "Postman", subtitle: "API testing", slug: "postman", tags: ["testing", "api"] },
  { id: "tool-4", type: "tool", title: "Figma", subtitle: "Design tool", slug: "figma", tags: ["design", "ui"] },
  { id: "tool-5", type: "tool", title: "Kubernetes", subtitle: "Container orchestration", slug: "kubernetes", tags: ["devops", "orchestration"] },
  // Navigation (quick actions)
  { id: "nav-1", type: "news", title: "API Playground", subtitle: "Test API endpoints", slug: "playground", tags: ["api", "playground", "tester", "json", "formatter"] },
  { id: "nav-2", type: "news", title: "Tech News Feed", subtitle: "Latest developer news", slug: "news", tags: ["news", "developer", "feed"] },
];

// ─── Search Logic ───────────────────────────────────────────────

/**
 * Scores a search match. Higher score = better relevance.
 * - Exact title match: 100
 * - Title starts with query: 80
 * - Title contains query: 60
 * - Subtitle match: 40
 * - Tag match: 20
 */
function scoreMatch(item: SearchableItem, query: string): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const subtitle = item.subtitle.toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (subtitle.includes(q)) return 40;
  if (item.tags?.some((tag) => tag.includes(q))) return 20;

  return 0;
}

/**
 * Filters and ranks items against a query.
 * Returns items sorted by relevance score (descending).
 */
function searchItems(
  items: SearchableItem[],
  query: string
): SearchableItem[] {
  if (!query.trim()) return [];

  const scored = items
    .map((item) => ({ item, score: scoreMatch(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map(({ item }) => item);
}

/**
 * Groups flat search results by type for display.
 */
function groupResults(
  items: SearchableItem[]
): Record<string, SearchableItem[]> {
  const groups: Record<string, SearchableItem[]> = {};

  for (const item of items) {
    const key = item.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  return groups;
}

// ─── Hook ───────────────────────────────────────────────────────

interface UseSearchOptions {
  /** External items to search (overrides preview data). */
  items?: SearchableItem[];
  /** Debounce delay in ms. Default: 150. */
  debounceMs?: number;
}

interface UseSearchReturn {
  /** The debounced query string. */
  debouncedQuery: string;
  /** Flat list of results sorted by relevance. */
  results: SearchResult[];
  /** Results grouped by type (api, tool, news). */
  groupedResults: Record<string, SearchResult[]>;
  /** Whether there are any results. */
  hasResults: boolean;
  /** Total result count. */
  totalCount: number;
}

/**
 * Abstracted search hook.
 *
 * Accepts a raw query string and optional external items.
 * Returns debounced, scored, and grouped results.
 *
 * Designed for future swap to API-based search:
 * - Replace `items` with fetch results
 * - Or replace this hook entirely with a server-side search endpoint
 */
export function useSearch(
  query: string,
  options: UseSearchOptions = {}
): UseSearchReturn {
  const { items = PREVIEW_ITEMS, debounceMs = 150 } = options;

  const debouncedQuery = useDebounce(query, debounceMs);

  const results = useMemo(() => {
    const matched = searchItems(items, debouncedQuery);

    return matched.map((item): SearchResult => ({
      id: item.id,
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      slug: item.slug,
      url:
        item.type === "api"
          ? `/apis/${item.slug}`
          : item.type === "tool"
            ? `/tools/${item.slug}`
            : `/${item.slug}`,
    }));
  }, [items, debouncedQuery]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const result of results) {
      if (!groups[result.type]) groups[result.type] = [];
      groups[result.type].push(result);
    }
    return groups;
  }, [results]);

  return {
    debouncedQuery,
    results,
    groupedResults,
    hasResults: results.length > 0,
    totalCount: results.length,
  };
}
