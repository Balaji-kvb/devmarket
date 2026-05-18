"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Layers, Wrench, ArrowRight } from "lucide-react";
import { getRecommendations, type ScoredRecommendation } from "@/lib/recommendation-service";

// ─── Component ──────────────────────────────────────────────────

/**
 * Smart recommendation grid.
 * Fetches personalized recommendations from the server-side
 * recommendation service backed by PostgreSQL user data.
 */
export function RecommendationGrid() {
  const [recommendations, setRecommendations] = useState<ScoredRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const recs = await getRecommendations(6);
        if (!cancelled) setRecommendations(recs);
      } catch {
        // Silent fail — empty recs
      }
      if (!cancelled) setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return <RecommendationSkeleton />;
  }

  if (recommendations.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles size={32} className="text-violet-400/50 mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-sm font-medium text-text-secondary mb-1">
          Personalized recommendations
        </h3>
        <p className="text-xs text-text-muted">
          Save some APIs and tools to get intelligent suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} item={rec} />
      ))}
    </div>
  );
}

// ─── Card ───────────────────────────────────────────────────────

function RecommendationCard({ item }: { item: ScoredRecommendation }) {
  const Icon = item.type === "api" ? Layers : Wrench;
  const url = item.type === "api" ? `/apis/${item.slug}` : `/tools/${item.slug}`;
  const accentColor = item.type === "api"
    ? "text-accent bg-accent/10"
    : "text-emerald-400 bg-emerald-500/10";

  return (
    <Link
      href={url}
      className="
        group flex flex-col gap-3 p-4
        bg-white/[0.02] border border-white/[0.06]
        rounded-xl
        hover:bg-white/[0.04] hover:border-violet-500/20
        hover:shadow-lg hover:shadow-violet-500/5
        transition-all duration-300
      "
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accentColor}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
          <p className="text-xs text-text-muted truncate mt-0.5">{item.tagline}</p>
        </div>
        <ArrowRight
          size={14}
          className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
        />
      </div>

      {/* Reason badge */}
      <div className="flex items-center gap-1.5">
        <Sparkles size={10} className="text-violet-400" />
        <span className="text-[10px] text-violet-400/80 font-medium">{item.reason}</span>
      </div>
    </Link>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function RecommendationSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-3 p-4 bg-white/[0.02] rounded-xl animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.06]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-white/[0.06] rounded" />
              <div className="h-2.5 w-40 bg-white/[0.04] rounded" />
            </div>
          </div>
          <div className="h-2.5 w-36 bg-violet-500/10 rounded" />
        </div>
      ))}
    </div>
  );
}
