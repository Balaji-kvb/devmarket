/**
 * /apis/[slug] — API Detail Page (Server Component).
 *
 * Dynamic route using slug to find API from seed data.
 * Uses generateMetadata for SEO.
 * Calls notFound() for invalid slugs.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAPIBySlug, getRelatedAPIs } from "@/lib/data";

import { APIHero } from "@/components/apis/APIHero";
import { APIEndpointList } from "@/components/apis/APIEndpointList";
import { APIExampleResponse } from "@/components/apis/APIExampleResponse";
import { APIMetadata } from "@/components/apis/APIMetadata";
import { APIRelated } from "@/components/apis/APIRelated";

// ─── Metadata ───────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const api = getAPIBySlug(slug);

  if (!api) {
    return { title: "API Not Found — DevMarket" };
  }

  return {
    title: `${api.name} — DevMarket`,
    description: api.description,
    openGraph: {
      title: `${api.name} — ${api.provider}`,
      description: api.tagline,
    },
  };
}

// ─── Page ───────────────────────────────────────────────────────

export default async function APIDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const api = getAPIBySlug(slug);

  if (!api) {
    notFound();
  }

  const relatedAPIs = getRelatedAPIs(api.slug, api.category, 3);
  const endpoints = api.exampleEndpoints ?? [];

  return (
    <div className="page-container animate-fade-in">
      {/* ── Hero ────────────────────────────────────────────── */}
      <APIHero api={api} />

      {/* ── Two-column layout: content + sidebar ────────────── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Main content column ────────────────────────────── */}
        <div className="space-y-6 min-w-0">
          {/* Endpoint list */}
          {endpoints.length > 0 && (
            <APIEndpointList endpoints={endpoints} baseUrl={api.baseUrl} />
          )}

          {/* Example responses */}
          <APIExampleResponse endpoints={endpoints} />
        </div>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <APIMetadata api={api} />
          </div>
        </aside>

        {/* ── Mobile metadata (below content) ────────────────── */}
        <div className="lg:hidden">
          <APIMetadata api={api} />
        </div>
      </div>

      {/* ── Related APIs ────────────────────────────────────── */}
      {relatedAPIs.length > 0 && (
        <div className="mt-8">
          <APIRelated apis={relatedAPIs} category={api.category} />
        </div>
      )}
    </div>
  );
}
