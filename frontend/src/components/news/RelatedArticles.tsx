import { NewsCard } from "./NewsCard";
import type { NewsArticle } from "@/lib/news";

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="glass-card p-6 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-muted">
            Related stories
          </p>
          <h3 className="text-lg font-semibold text-text-primary">
            More articles we think you’ll enjoy
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} className="p-0" />
        ))}
      </div>
    </section>
  );
}
