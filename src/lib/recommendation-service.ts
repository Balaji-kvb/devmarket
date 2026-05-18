"use server";

/**
 * DevMarket — Server-Side Recommendation Service
 *
 * Generates personalized recommendations from DB-persisted user data.
 * Scoring engine runs server-side for better performance and data access.
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllAPIs, getAllTools, type APIItem, type ToolItem } from "@/lib/data";

// ─── Types ──────────────────────────────────────────────────────

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

interface InterestProfile {
  categories: Map<string, number>;
  excludeIds: Set<string>;
}

// ─── Interest Profile Builder ───────────────────────────────────

async function buildInterestProfile(userId: string): Promise<InterestProfile> {
  const categories = new Map<string, number>();
  const excludeIds = new Set<string>();

  try {
    // Bookmarks — weight 3
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: { slug: true, category: true, type: true },
    });
    for (const b of bookmarks) {
      categories.set(b.category, (categories.get(b.category) || 0) + 3);
      excludeIds.add(`${b.type}-${b.slug}`);
    }

    // Collection items — weight 2
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: { items: { select: { slug: true, category: true, type: true } } },
    });
    for (const c of collections) {
      for (const item of c.items) {
        categories.set(item.category, (categories.get(item.category) || 0) + 2);
        excludeIds.add(`${item.type}-${item.slug}`);
      }
    }

    // Recent views — weight 1
    const views = await prisma.recentView.findMany({
      where: { userId },
      select: { slug: true, category: true, type: true },
    });
    for (const v of views) {
      categories.set(v.category, (categories.get(v.category) || 0) + 1);
      excludeIds.add(`${v.type}-${v.slug}`);
    }
  } catch {
    // DB not available — return empty profile
  }

  return { categories, excludeIds };
}

// ─── Scoring ────────────────────────────────────────────────────

function scoreItem(
  item: { category: string; tags: string[]; featured: boolean },
  profile: InterestProfile
): number {
  let score = 0;

  // +40 category match + frequency bonus
  const catWeight = profile.categories.get(item.category) || 0;
  if (catWeight > 0) score += 40 + Math.min(catWeight * 5, 20);

  // +10 trending/featured bonus
  if (item.featured) score += 10;

  return score;
}

// ─── Main Function ──────────────────────────────────────────────

export async function getRecommendations(limit = 6): Promise<ScoredRecommendation[]> {
  const session = await auth();
  if (!session?.user?.id) {
    // Return trending for unauthenticated users
    return getTrendingItems(limit);
  }

  try {
    const profile = await buildInterestProfile(session.user.id);
    const apis = getAllAPIs();
    const tools = getAllTools();
    const scored: ScoredRecommendation[] = [];

    for (const api of apis) {
      if (profile.excludeIds.has(`api-${api.slug}`)) continue;
      const s = scoreItem(
        { category: api.category, tags: api.tags, featured: api.featured },
        profile
      );
      if (s > 0) {
        scored.push({
          id: api.id, type: "api", name: api.name, slug: api.slug,
          tagline: api.tagline, category: api.category, tags: api.tags,
          score: s, reason: `Based on your interest in ${api.category}`,
        });
      }
    }

    for (const tool of tools) {
      if (profile.excludeIds.has(`tool-${tool.slug}`)) continue;
      const s = scoreItem(
        { category: tool.category, tags: tool.tags, featured: tool.featured },
        profile
      );
      if (s > 0) {
        scored.push({
          id: tool.id, type: "tool", name: tool.name, slug: tool.slug,
          tagline: tool.tagline, category: tool.category, tags: tool.tags,
          score: s, reason: `Based on your interest in ${tool.category}`,
        });
      }
    }

    const results = scored.sort((a, b) => b.score - a.score).slice(0, limit);

    // Fallback to trending if not enough personalized results
    if (results.length < 3) {
      const trending = getTrendingItems(limit);
      const existingIds = new Set(results.map((r) => r.id));
      for (const t of trending) {
        if (!existingIds.has(t.id) && results.length < limit) {
          results.push(t);
        }
      }
    }

    return results;
  } catch {
    return getTrendingItems(limit);
  }
}

function getTrendingItems(limit: number): ScoredRecommendation[] {
  const apis = getAllAPIs();
  const tools = getAllTools();
  const trending: ScoredRecommendation[] = [];

  for (const api of apis) {
    if (!api.featured) continue;
    trending.push({
      id: api.id, type: "api", name: api.name, slug: api.slug,
      tagline: api.tagline, category: api.category, tags: api.tags,
      score: api.savedCount || 0, reason: "Trending on DevMarket",
    });
  }

  for (const tool of tools) {
    if (!tool.featured) continue;
    trending.push({
      id: tool.id, type: "tool", name: tool.name, slug: tool.slug,
      tagline: tool.tagline, category: tool.category, tags: tool.tags,
      score: 50, reason: "Popular developer tool",
    });
  }

  return trending.sort((a, b) => b.score - a.score).slice(0, limit);
}
