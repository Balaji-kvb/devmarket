import { Zap } from "lucide-react";
import { NewsCard } from "./NewsCard";
import type { NewsArticle } from "@/lib/news";

interface TrendingNewsRowProps {
  articles: NewsArticle[];
}

export function TrendingNewsRow({ articles }: TrendingNewsRowProps) {
  if (articles.length === 0) return null;

  return (
    <section className="glass-card p-5 border-white/[0.06]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-muted mb-1">
            Trending now
          </p>
          <h3 className="text-lg font-semibold text-text-primary">
            Must-read developer stories
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-text-muted font-semibold uppercase tracking-[0.2em]">
          <Zap size={14} aria-hidden="true" />
          Live updates
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} className="p-0" />
        ))}
      </div>
    </section>
  );
}
