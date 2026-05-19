/**
 * DevMarket — Lightweight Recommendation Engine
 *
 * Pure-function scoring engine that generates personalized
 * recommendations from user behavior (bookmarks, views, collections).
 *
 * Scoring tiers:
 *   +40  category match
 *   +30  tag overlap (per overlapping tag)
 *   +20  same platform
 *   +10  trending bonus (featured items)
 *
 * No database required — operates on in-memory data arrays.
 */

import type { APIItem, ToolItem } from "@/lib/data";
import type { BookmarkEntry, RecentViewEntry, CollectionEntry } from "@/providers/UserStoreProvider";

// ─── Types ──────────────────────────────────────────────────────

export interface InterestProfile {
  /** Categories the user has engaged with, sorted by frequency. */
  categories: Map<string, number>;
  /** Tags the user has engaged with, sorted by frequency. */
  tags: Map<string, number>;
  /** Platforms the user prefers (tools only). */
  platforms: Map<string, number>;
  /** IDs of items already saved/viewed (to exclude). */
  excludeIds: Set<string>;
}

export interface ScoredRecommendation {
  id: string;
  type: "api" | "tool";
  name: string;
  slug: string;
  tagline: string;
  category: string;
  tags: string[];
  score: number;
  reason: string;
}

// ─── Interest Profile Builder ───────────────────────────────────

/**
 * Builds an interest profile from the user's bookmarks,
 * recent views, and collections.
 */
export function buildInterestProfile(
  bookmarks: BookmarkEntry[],
  recentViews: RecentViewEntry[],
  collections: CollectionEntry[]
): InterestProfile {
  const categories = new Map<string, number>();
  const tags = new Map<string, number>();
  const platforms = new Map<string, number>();
  const excludeIds = new Set<string>();

  // Weight bookmarks higher (explicit intent)
  for (const b of bookmarks) {
    categories.set(b.category, (categories.get(b.category) || 0) + 3);
    excludeIds.add(b.id);
  }

  // Recent views have moderate weight
  for (const v of recentViews) {
    categories.set(v.category, (categories.get(v.category) || 0) + 1);
    excludeIds.add(v.id);
  }

  // Collection items have high weight (curated intent)
  for (const c of collections) {
    for (const item of c.items) {
      categories.set(item.category, (categories.get(item.category) || 0) + 2);
      excludeIds.add(item.id);
    }
  }

  return { categories, tags, platforms, excludeIds };
}

// ─── Scoring ────────────────────────────────────────────────────

/**
 * Scores a single item against the user's interest profile.
 */
function scoreItem(
  item: { id: string; category: string; tags: string[]; featured: boolean; platform?: string[] },
  profile: InterestProfile
): number {
  let score = 0;

  // Category match: +40 × frequency weight
  const catWeight = profile.categories.get(item.category) || 0;
  if (catWeight > 0) score += 40 + Math.min(catWeight * 5, 20);

  // Tag overlap: +30 per matching tag (capped at 3)
  let tagMatches = 0;
  for (const tag of item.tags) {
    if (profile.tags.has(tag)) {
      tagMatches++;
      if (tagMatches >= 3) break;
    }
  }
  score += tagMatches * 30;

  // Platform match: +20
  if (item.platform) {
    for (const p of item.platform) {
      if (profile.platforms.has(p)) {
        score += 20;
        break;
      }
    }
  }

  // Trending / featured bonus: +10
  if (item.featured) score += 10;

  return score;
}

// ─── Main Recommendation Functions ──────────────────────────────

/**
 * Generates personalized recommendations based on user behavior.
 * Excludes already-saved items. Caps at `limit` results.
 */
export function getRecommendations(
  apis: APIItem[],
  tools: ToolItem[],
  profile: InterestProfile,
  limit = 6
): ScoredRecommendation[] {
  const scored: ScoredRecommendation[] = [];

  // Score all APIs
  for (const api of apis) {
    if (profile.excludeIds.has(api.id)) continue;
    const s = scoreItem(
      { id: api.id, category: api.category, tags: api.tags, featured: api.featured },
      profile
    );
    if (s > 0) {
      scored.push({
        id: api.id,
        type: "api",
        name: api.name,
        slug: api.slug,
        tagline: api.tagline,
        category: api.category,
        tags: api.tags,
        score: s,
        reason: `Based on your interest in ${api.category}`,
      });
    }
  }

  // Score all tools
  for (const tool of tools) {
    if (profile.excludeIds.has(tool.id)) continue;
    const s = scoreItem(
      { id: tool.id, category: tool.category, tags: tool.tags, featured: tool.featured, platform: tool.platform },
      profile
    );
    if (s > 0) {
      scored.push({
        id: tool.id,
        type: "tool",
        name: tool.name,
        slug: tool.slug,
        tagline: tool.tagline,
        category: tool.category,
        tags: tool.tags,
        score: s,
        reason: `Based on your interest in ${tool.category}`,
      });
    }
  }

  // Sort descending by score, then cap
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Returns trending items — featured items the user hasn't saved yet.
 * Useful as a fallback when the interest profile is sparse.
 */
export function getTrendingRecommendations(
  apis: APIItem[],
  tools: ToolItem[],
  excludeIds: Set<string>,
  limit = 6
): ScoredRecommendation[] {
  const trending: ScoredRecommendation[] = [];

  for (const api of apis) {
    if (excludeIds.has(api.id) || !api.featured) continue;
    trending.push({
      id: api.id,
      type: "api",
      name: api.name,
      slug: api.slug,
      tagline: api.tagline,
      category: api.category,
      tags: api.tags,
      score: api.savedCount || 0,
      reason: "Trending on DevMarket",
    });
  }

  for (const tool of tools) {
    if (excludeIds.has(tool.id) || !tool.featured) continue;
    trending.push({
      id: tool.id,
      type: "tool",
      name: tool.name,
      slug: tool.slug,
      tagline: tool.tagline,
      category: tool.category,
      tags: tool.tags,
      score: 50,
      reason: "Popular developer tool",
    });
  }

  return trending.sort((a, b) => b.score - a.score).slice(0, limit);
}
