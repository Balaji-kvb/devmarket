import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { CategoryTag } from "@/components/shared";
import type { NewsArticle } from "@/lib/news";

interface ArticleHeaderProps {
  article: NewsArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const published = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="glass-card overflow-hidden border-white/[0.06]">
      <div className="relative overflow-hidden aspect-[16/7] sm:aspect-[16/8]">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CategoryTag category={article.category} className="bg-black/50 border-white/10 text-white" />
            <span className="inline-flex items-center gap-2 text-[11px] text-white/70 uppercase tracking-[0.24em]">
              <CalendarDays size={14} aria-hidden="true" />
              {published}
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] text-white/70 uppercase tracking-[0.24em]">
              <Clock size={14} aria-hidden="true" />
              {article.readTime} min read
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 border-t border-white/[0.06] bg-[#090a10]/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-text-muted">
            Written by <span className="text-text-primary font-semibold">{article.author}</span>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-2 transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to news
          </Link>
        </div>
      </div>
    </div>
  );
}
