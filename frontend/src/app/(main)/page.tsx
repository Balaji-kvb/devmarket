/**
 * Homepage — Discover Page (Phase 7).
 *
 * Server component. All data loaded at build time from seed JSON.
 * Sections: Stats → Featured APIs → Popular Tools → Latest News.
 */
import Link from "next/link";
import {
  Layers,
  Wrench,
  Grid3x3,
  Zap,
  ArrowRight,
} from "lucide-react";
import { getFeaturedAPIs, getFeaturedTools, getPlatformStats } from "@/lib/data";
import { getLatestNews } from "@/lib/news";
import { APICard } from "@/components/cards/APICard";
import { ToolCard } from "@/components/cards/ToolCard";
import { NewsCard } from "@/components/news/NewsCard";

// ─── Data ───────────────────────────────────────────────────────

const featuredAPIs = getFeaturedAPIs(6);
const popularTools = getFeaturedTools(10);
const latestNews = getLatestNews(4);
const stats = getPlatformStats();

// ─── Stats Config ───────────────────────────────────────────────

const STATS = [
  { label: "APIs", value: stats.totalAPIs, icon: Layers },
  { label: "Tools", value: stats.totalTools, icon: Wrench },
  { label: "Categories", value: stats.totalCategories, icon: Grid3x3 },
  { label: "Endpoints", value: stats.totalEndpoints, icon: Zap },
];

// ─── Section Header ─────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View all",
}: {
  title: string;
  subtitle: string;
  href: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-lg font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="
          flex items-center gap-1
          text-xs text-text-muted hover:text-accent
          font-medium
          transition-colors duration-200
          shrink-0
        "
      >
        {linkText}
        <ArrowRight size={12} aria-hidden="true" />
      </Link>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="page-container animate-fade-in">

      {/* ── Hero / Heading ───────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gradient mb-2">
          Discover
        </h1>
        <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
          Explore APIs, developer tools, and the latest in tech — all from one platform.
        </p>
      </div>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="
                glass-card p-4
                flex items-center gap-3
              "
            >
              <div className="
                w-9 h-9 rounded-lg shrink-0
                bg-accent/8 border border-accent/15
                flex items-center justify-center
              ">
                <Icon size={16} className="text-accent" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary leading-none mb-0.5">
                  {stat.value}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Featured APIs ────────────────────────────────────── */}
      <section className="mb-10">
        <SectionHeader
          title="Featured APIs"
          subtitle="Handpicked APIs with excellent documentation and reliability"
          href="/apis"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {featuredAPIs.map((api) => (
            <APICard key={api.id} api={api} />
          ))}
        </div>
      </section>

      {/* ── Popular Tools ────────────────────────────────────── */}
      <section className="mb-10">
        <SectionHeader
          title="Popular Tools"
          subtitle="Essential developer tools trusted by engineering teams worldwide"
          href="/tools"
        />
        <div
          className="
            flex gap-4 overflow-x-auto
            pb-2 -mb-2
            no-scrollbar
            snap-x snap-mandatory
          "
        >
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} className="snap-start" />
          ))}
        </div>
      </section>

      {/* ── Latest News ──────────────────────────────────────── */}
      <section className="mb-6">
        <SectionHeader
          title="Latest News"
          subtitle="Stay up to date with the developer ecosystem"
          href="/news"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {latestNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
