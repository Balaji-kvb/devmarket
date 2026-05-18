import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { CategoryTag } from "@/components/shared";
import type { NewsItem } from "@/lib/data";

// ─── Types ──────────────────────────────────────────────────────

interface NewsCardProps {
  article: NewsItem;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * News preview card for the homepage feed.
 * Uses mock data until Phase 13 (News page build).
 */
export function NewsCard({ article, className = "" }: NewsCardProps) {
  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`
        group block
        glass-card p-4
        transition-all duration-200
        hover:border-white/[0.12]
        hover:shadow-lg hover:shadow-black/20
        ${className}
      `}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <CategoryTag category={article.category} />
        <span className="text-[10px] text-text-muted flex items-center gap-1">
          <Clock size={10} aria-hidden="true" />
          {article.readTime} min
        </span>
      </div>

      {/* ── Title ───────────────────────────────────────────── */}
      <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1.5 group-hover:text-accent transition-colors duration-200 line-clamp-2">
        {article.title}
      </h3>

      {/* ── Excerpt ─────────────────────────────────────────── */}
      <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">
        {article.excerpt}
      </p>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-muted">
          {article.source} · {formattedDate}
        </span>
        <ArrowUpRight
          size={12}
          className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
