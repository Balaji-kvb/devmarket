/**
 * News data layer — loads and queries news articles.
 */

import newsData from "@/data/news.json";

// ─── Types ──────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  featuredImage: string;
  featured: boolean;
  trending: boolean;
  source: string;
}

// ─── Queries ────────────────────────────────────────────────────

const articles = newsData as NewsArticle[];

export function getAllNews(): NewsArticle[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getLatestNews(limit = 4): NewsArticle[] {
  return getAllNews().slice(0, limit);
}

export function getFeaturedNews(limit = 1): NewsArticle[] {
  return getAllNews().filter((a) => a.featured).slice(0, limit);
}

export function getTrendingNews(limit = 5): NewsArticle[] {
  return getAllNews().filter((a) => a.trending).slice(0, limit);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getNewsCategories(): string[] {
  return [...new Set(articles.map((a) => a.category))];
}

export function getRelatedNews(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 4
): NewsArticle[] {
  return articles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => {
      let score = 0;
      if (a.category === category) score += 3;
      const sharedTags = a.tags.filter((t) => tags.includes(t)).length;
      score += sharedTags;
      return { article: a, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);
}

export function searchNews(
  query: string,
  category?: string
): NewsArticle[] {
  let results = articles;

  if (category) {
    results = results.filter((a) => a.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.author.toLowerCase().includes(q)
    );
  }

  return results;
}
