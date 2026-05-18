"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FeaturedNewsCard } from "./FeaturedNewsCard";
import { TrendingNewsRow } from "./TrendingNewsRow";
import { NewsSearchBar } from "./NewsSearchBar";
import { NewsCategoryFilter } from "./NewsCategoryFilter";
import { NewsCard } from "./NewsCard";
import { NewsEmptyState } from "./NewsEmptyState";
import type { NewsArticle } from "@/lib/news";

interface NewsFeedProps {
  articles: NewsArticle[];
}

export function NewsFeed({ articles }: NewsFeedProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles]
  );

  const featuredArticle = useMemo(
    () => articles.find((article) => article.featured) ?? articles[0],
    [articles]
  );

  const trendingArticles = useMemo(
    () => articles.filter((article) => article.trending).slice(0, 4),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles
      .filter((article) =>
        activeCategory === "All" ? true : article.category === activeCategory
      )
      .filter((article) => {
        if (!normalizedQuery) return true;
        return [article.title, article.excerpt, article.author, article.source]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
          || article.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }, [articles, activeCategory, query]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleArticles.length < filteredArticles.length;

  return (
    <div className="page-container animate-fade-in">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr] mb-6">
        <div className="glass-card p-6 lg:p-8">
          <span className="text-xs uppercase tracking-[0.28em] text-text-muted font-semibold">
            News feed
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
            Premium developer news, insights, and playbooks.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-text-secondary leading-7">
            Curated coverage for engineering teams building APIs, cloud platforms, and AI experiences. Search by topic, filter by category, and read the articles shaping the ecosystem.
          </p>

          <div className="grid gap-3 sm:grid-cols-3 mt-8">
            <div className="glass-card p-4 bg-white/[0.04] border border-white/[0.06]">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Articles</p>
              <p className="mt-2 text-xl font-semibold text-text-primary">{articles.length}</p>
            </div>
            <div className="glass-card p-4 bg-white/[0.04] border border-white/[0.06]">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Categories</p>
              <p className="mt-2 text-xl font-semibold text-text-primary">{categories.length - 1}</p>
            </div>
            <div className="glass-card p-4 bg-white/[0.04] border border-white/[0.06]">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Trending</p>
              <p className="mt-2 text-xl font-semibold text-text-primary">{trendingArticles.length}</p>
            </div>
          </div>
        </div>

        {featuredArticle ? <FeaturedNewsCard article={featuredArticle} /> : null}
      </section>

      <TrendingNewsRow articles={trendingArticles} />

      <section className="glass-card p-6 mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Explore stories</h2>
            <p className="text-sm text-text-muted">Search and filter by category to find the latest engineering insights.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <NewsSearchBar query={query} onQueryChange={setQuery} />
          </div>
        </div>

        <NewsCategoryFilter
          categories={categories.slice(1)}
          activeCategory={activeCategory}
          onCategoryChange={(category) => {
            setActiveCategory(category);
            setVisibleCount(8);
          }}
        />

        <div className="grid gap-4 mt-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="mt-8">
            <NewsEmptyState
              query={query}
              category={activeCategory}
              onClearFilters={() => {
                setQuery("");
                setActiveCategory("All");
                setVisibleCount(8);
              }}
            />
          </div>
        ) : null}

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 8)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              Load more stories
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
