"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Layers, Wrench, ArrowRight } from "lucide-react";
import { getRecommendations, type ScoredRecommendation } from "@/lib/recommendation-service";

// ─── Component ──────────────────────────────────────────────────

/**
 * Displays trending APIs and tools.
 * Fetches data from the server-side recommendation service.
 * Uses amber/orange accent for the "trending" visual identity.
 */
export function TrendingSection() {
  const [trending, setTrending] = useState<ScoredRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const recs = await getRecommendations(4);
        // Filter for trending items (featured/popular)
        const trendingItems = recs.filter(
          (r) => r.reason.includes("Trending") || r.reason.includes("Popular")
        );
        if (!cancelled) setTrending(trendingItems.length > 0 ? trendingItems : recs.slice(0, 4));
      } catch {
        // Silent fail
      }
      if (!cancelled) setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return <TrendingSkeleton />;
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {trending.map((item) => {
        const Icon = item.type === "api" ? Layers : Wrench;
        const url = item.type === "api" ? `/apis/${item.slug}` : `/tools/${item.slug}`;
        return (
          <Link
            key={item.id}
            href={url}
            className="
              group flex items-center gap-3 p-3.5
              bg-white/[0.02] border border-white/[0.06]
              rounded-xl
              hover:bg-white/[0.04] hover:border-amber-500/20
              transition-all duration-200
            "
          >
            <div className="
              w-9 h-9 rounded-lg shrink-0
              flex items-center justify-center
              bg-amber-500/10 text-amber-400
            ">
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <TrendingUp size={10} className="text-amber-400" />
                <span className="text-[10px] text-amber-400/80 font-medium">{item.reason}</span>
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </Link>
        );
      })}
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function TrendingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3.5 bg-white/[0.02] rounded-xl animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-white/[0.06]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 bg-white/[0.06] rounded" />
            <div className="h-2.5 w-20 bg-amber-500/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
