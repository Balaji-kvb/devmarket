export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug, getRelatedNews } from "@/lib/news";
import { ArticleHeader } from "@/components/news/ArticleHeader";
import { ArticleContent } from "@/components/news/ArticleContent";
import { RelatedArticles } from "@/components/news/RelatedArticles";

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllNews().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getNewsBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "Article not found — DevMarket",
      description: "The requested news article could not be found.",
    };
  }

  return {
    title: `${article.title} — DevMarket News`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — DevMarket News`,
      description: article.excerpt,
      url: `https://devmarket.example.com/news/${article.slug}`,
      type: "article",
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} — DevMarket News`,
      description: article.excerpt,
      images: [article.featuredImage],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const resolvedParams = await params;
  const article = getNewsBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedNews(article.slug, article.category, article.tags, 4);

  return (
    <div className="page-container animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <main className="space-y-8">
          <ArticleHeader article={article} />
          <div className="glass-card p-6 sm:p-8 border-white/[0.06]">
            <ArticleContent content={article.content} />
          </div>

          <RelatedArticles articles={related} />
        </main>

        <aside className="space-y-4">
          <div className="glass-card p-6 border-white/[0.06] sticky top-6">
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted mb-4">
              Quick details
            </p>
            <div className="space-y-3 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary">Author</p>
                <p>{article.author}</p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Category</p>
                <p>{article.category}</p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Source</p>
                <p>{article.source}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-white/[0.06]">
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted mb-4">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.24em] bg-white/[0.05] border border-white/[0.08] text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
