"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllAPIs, getAllTools } from "@/lib/data";
import { getAllNews } from "@/lib/news";
import type { APIItem, ToolItem } from "@/lib/data";

// ─── Types ──────────────────────────────────────────────────────

export type ResultType = "api" | "tool" | "nav" | "news";

export interface CommandResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  category: string;
  url: string;
}

export interface GroupedResults {
  api: CommandResult[];
  tool: CommandResult[];
  news: CommandResult[];
  nav: CommandResult[];
}

// ─── Navigation Items ───────────────────────────────────────────

const NAV_ITEMS: CommandResult[] = [
  { id: "nav-home", type: "nav", title: "Home", subtitle: "Go to dashboard", category: "Page", url: "/" },
  { id: "nav-apis", type: "nav", title: "API Marketplace", subtitle: "Browse all APIs", category: "Page", url: "/apis" },
  { id: "nav-tools", type: "nav", title: "Tools Directory", subtitle: "Browse developer tools", category: "Page", url: "/tools" },
  { id: "nav-playground", type: "nav", title: "API Playground", subtitle: "Test API endpoints", category: "Page", url: "/playground" },
  { id: "nav-playground-tester", type: "nav", title: "API Tester", subtitle: "Send live API requests", category: "Page", url: "/playground" },
  { id: "nav-playground-json", type: "nav", title: "JSON Formatter", subtitle: "Validate and format JSON payloads", category: "Page", url: "/playground" },
  { id: "nav-news", type: "nav", title: "News Feed", subtitle: "Latest developer news", category: "Page", url: "/news" },
  { id: "nav-dashboard", type: "nav", title: "Dashboard", subtitle: "Your saved items", category: "Page", url: "/dashboard" },
];

// ─── Recent Searches ────────────────────────────────────────────

const RECENT_KEY = "devmarket-recent-searches";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_KEY);
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
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch {
    /* localStorage unavailable */
  }
}

function clearRecentSearchesStorage(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(RECENT_KEY); } catch { /* noop */ }
}

// ─── Search Scoring ─────────────────────────────────────────────

/**
 * Scores a command result against a query.
 * Higher = better relevance.
 *
 * Scoring tiers:
 *   100 — exact title match
 *    80 — title starts with query
 *    60 — title contains query
 *    40 — subtitle/category contains query
 *    20 — matched in extended fields (tags etc.)
 */
function scoreResult(result: CommandResult, query: string, extra?: string): number {
  const q = query.toLowerCase();
  const title = result.title.toLowerCase();
  const subtitle = result.subtitle.toLowerCase();
  const category = result.category.toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (subtitle.includes(q) || category.includes(q)) return 40;
  if (extra?.toLowerCase().includes(q)) return 20;

  return 0;
}

// ─── Hook ───────────────────────────────────────────────────────

interface UseCommandPaletteReturn {
  /** Whether the palette is open. */
  isOpen: boolean;
  /** Open/close the palette. */
  setOpen: (open: boolean) => void;
  /** Toggle the palette. */
  toggle: () => void;
  /** Current search query. */
  query: string;
  /** Update the search query. */
  setQuery: (q: string) => void;
  /** Debounced search query. */
  debouncedQuery: string;
  /** Search results grouped by type. */
  grouped: GroupedResults;
  /** Whether results exist. */
  hasResults: boolean;
  /** Total result count. */
  totalCount: number;
  /** Recent search terms. */
  recentSearches: string[];
  /** Navigate to a result URL. */
  select: (url: string, title: string) => void;
  /** Re-run a recent search. */
  replayRecent: (term: string) => void;
  /** Clear recent searches. */
  clearRecent: () => void;
}

export function useCommandPalette(): UseCommandPaletteReturn {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 120);

  // ── Build search index from real data (memoized once) ─────
  const { apiResults, toolResults, newsResults } = useMemo(() => {
    const apis = getAllAPIs();
    const tools = getAllTools();
    const news = getAllNews();

    const apiResults: { result: CommandResult; extra: string }[] = apis.map((api: APIItem) => ({
      result: {
        id: api.id,
        type: "api" as const,
        title: api.name,
        subtitle: `${api.provider} · ${api.tagline}`,
        category: api.category,
        url: `/apis/${api.slug}`,
      },
      extra: [api.description, api.provider, ...(api.tags || [])].join(" "),
    }));

    const toolResults: { result: CommandResult; extra: string }[] = tools.map((tool: ToolItem) => ({
      result: {
        id: tool.id,
        type: "tool" as const,
        title: tool.name,
        subtitle: tool.tagline,
        category: tool.category,
        url: `/tools/${tool.slug}`,
      },
      extra: [tool.description, ...(tool.platform || []), ...(tool.tags || [])].join(" "),
    }));

    const newsResults: { result: CommandResult; extra: string }[] = news.map((article) => ({
      result: {
        id: article.id,
        type: "news" as const,
        title: article.title,
        subtitle: `${article.source} · ${article.excerpt}`,
        category: article.category,
        url: `/news/${article.slug}`,
      },
      extra: [article.excerpt, article.author, ...(article.tags || [])].join(" "),
    }));

    return { apiResults, toolResults, newsResults };
  }, []);

  // ── Perform search ────────────────────────────────────────
  const { grouped, hasResults, totalCount } = useMemo(() => {
    const q = debouncedQuery.trim();

    const empty: GroupedResults = { api: [], tool: [], news: [], nav: [] };

    if (!q) return { grouped: empty, hasResults: false, totalCount: 0 };

    // Score and filter APIs
    const scoredAPIs = apiResults
      .map(({ result, extra }) => ({ result, score: scoreResult(result, q, extra) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ result }) => result);

    // Score and filter Tools
    const scoredTools = toolResults
      .map(({ result, extra }) => ({ result, score: scoreResult(result, q, extra) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ result }) => result);

    const scoredNews = newsResults
      .map(({ result, extra }) => ({ result, score: scoreResult(result, q, extra) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ result }) => result);

    // Score and filter Nav
    const scoredNav = NAV_ITEMS
      .map((result) => ({ result, score: scoreResult(result, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ result }) => result);

    const result: GroupedResults = {
      api: scoredAPIs,
      tool: scoredTools,
      news: scoredNews,
      nav: scoredNav,
    };

    const total = scoredAPIs.length + scoredTools.length + scoredNews.length + scoredNav.length;

    return { grouped: result, hasResults: total > 0, totalCount: total };
  }, [debouncedQuery, apiResults, toolResults, newsResults]);

  // ── Load recent searches on open ──────────────────────────
  useEffect(() => {
    if (isOpen) setRecentSearches(getRecentSearches());
  }, [isOpen]);

  // ── Reset query on close ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setQuery(""), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ── Global keyboard shortcut: ⌘K / Ctrl+K ────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── Actions ───────────────────────────────────────────────
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const select = useCallback(
    (url: string, title: string) => {
      addRecentSearch(title);
      setOpen(false);
      router.push(url);
    },
    [router]
  );

  const replayRecent = useCallback((term: string) => {
    setQuery(term);
  }, []);

  const clearRecent = useCallback(() => {
    clearRecentSearchesStorage();
    setRecentSearches([]);
  }, []);

  return {
    isOpen,
    setOpen,
    toggle,
    query,
    setQuery,
    debouncedQuery,
    grouped,
    hasResults,
    totalCount,
    recentSearches,
    select,
    replayRecent,
    clearRecent,
  };
}
