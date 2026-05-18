"use client";

import { Bookmark, Clock, Layers, Wrench, FolderOpen, TrendingUp } from "lucide-react";
import { useUserStore } from "@/providers/UserStoreProvider";

// ─── Component ──────────────────────────────────────────────────

/**
 * Activity summary cards for the dashboard header.
 * Shows stats for saved items, recent views, collections, and category diversity.
 */
export function ActivitySummary() {
  const { bookmarks, recentViews, collections, isLoaded } = useUserStore();

  if (!isLoaded) {
    return <ActivitySummarySkeleton />;
  }

  const savedAPIs = bookmarks.filter((b) => b.type === "api").length;
  const savedTools = bookmarks.filter((b) => b.type === "tool").length;
  const uniqueCategories = new Set(bookmarks.map((b) => b.category)).size;

  const stats = [
    {
      label: "Saved APIs",
      value: savedAPIs,
      icon: Layers,
      color: "text-accent bg-accent/10",
    },
    {
      label: "Saved Tools",
      value: savedTools,
      icon: Wrench,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Collections",
      value: collections.length,
      icon: FolderOpen,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Recent Views",
      value: recentViews.length,
      icon: Clock,
      color: "text-violet-400 bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="
              flex items-center gap-3 p-4
              bg-white/[0.02] border border-white/[0.06]
              rounded-xl
            "
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <Icon size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-[11px] text-text-muted">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function ActivitySummarySkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-white/[0.06]" />
          <div className="space-y-1.5">
            <div className="h-5 w-8 bg-white/[0.06] rounded" />
            <div className="h-2.5 w-16 bg-white/[0.04] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
