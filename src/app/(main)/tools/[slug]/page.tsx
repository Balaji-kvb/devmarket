/**
 * /tools/[slug] — Tool Detail Page (Server Component).
 *
 * Dynamic route using slug to find tool from seed data.
 * Uses generateMetadata for SEO.
 * Calls notFound() for invalid slugs.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getRelatedTools } from "@/lib/data";

import { ToolHero } from "@/components/tools/ToolHero";
import { ToolFeatures } from "@/components/tools/ToolFeatures";
import { ToolPlatforms } from "@/components/tools/ToolPlatforms";
import { ToolMetadata } from "@/components/tools/ToolMetadata";
import { ToolRelated } from "@/components/tools/ToolRelated";

// ─── Metadata ───────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found — DevMarket" };
  }

  return {
    title: `${tool.name} — DevMarket`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — Developer Tool`,
      description: tool.tagline,
    },
  };
}

// ─── Page ───────────────────────────────────────────────────────

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool.slug, tool.category, 4);

  return (
    <div className="page-container animate-fade-in">
      {/* ── Hero ────────────────────────────────────────────── */}
      <ToolHero tool={tool} />

      {/* ── Two-column layout: content + sidebar ────────────── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Main content column ────────────────────────────── */}
        <div className="space-y-6 min-w-0">
          {/* Platform support */}
          <ToolPlatforms platforms={tool.platform} />

          {/* Features & installation */}
          <ToolFeatures tool={tool} />
        </div>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <ToolMetadata tool={tool} />
          </div>
        </aside>

        {/* ── Mobile metadata (below content) ────────────────── */}
        <div className="lg:hidden">
          <ToolMetadata tool={tool} />
        </div>
      </div>

      {/* ── Related Tools ───────────────────────────────────── */}
      {relatedTools.length > 0 && (
        <div className="mt-8">
          <ToolRelated tools={relatedTools} category={tool.category} />
        </div>
      )}
    </div>
  );
}
