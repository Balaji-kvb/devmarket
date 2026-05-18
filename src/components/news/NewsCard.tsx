import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { CategoryTag } from "@/components/shared";
import type { NewsArticle } from "@/lib/news";

interface NewsCardProps {
  article: NewsArticle;
  className?: string;
}

export function NewsCard({ article, className = "" }: NewsCardProps) {
  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/news/${article.slug}`}
      className={
        `group block glass-card overflow-hidden transition-all duration-200 hover:border-white/[0.16] hover:shadow-xl hover:shadow-black/20 ${className}`
      }
    >
      {article.featuredImage ? (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute left-4 bottom-4">
            <CategoryTag category={article.category} className="bg-black/45 border-white/10" />
          </div>
        </div>
      ) : null}

      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[10px] text-text-muted uppercase tracking-[0.24em]">
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
            <Clock size={10} aria-hidden="true" />
            {article.readTime} min
          </span>
        </div>

        <h3 className="text-base font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between gap-2 text-[11px] text-text-muted">
          <span>{article.author}</span>
          <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
