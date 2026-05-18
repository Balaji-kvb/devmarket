import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { CategoryTag } from "@/components/shared";
import type { NewsArticle } from "@/lib/news";

interface FeaturedNewsCardProps {
  article: NewsArticle;
}

export function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block glass-card overflow-hidden shadow-xl shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14]"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-5 top-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white bg-accent/90 rounded-full shadow-lg shadow-black/20">
            Featured
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <CategoryTag category={article.category} className="bg-white/[0.08] border-white/[0.08] text-white" />
          <span className="text-[11px] text-white/70 uppercase tracking-[0.24em]">
            {formattedDate} · {article.readTime} min read
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
          {article.title}
        </h2>
        <p className="text-sm text-white/70 leading-relaxed max-w-2xl mb-6">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
          <span>{article.author}</span>
          <span className="inline-flex items-center gap-1 text-accent">
            Read article <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
