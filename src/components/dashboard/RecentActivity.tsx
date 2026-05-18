"use client";

import Link from "next/link";
import { Clock, Layers, Wrench, ArrowRight } from "lucide-react";
import { useUserStore, type RecentViewEntry } from "@/providers/UserStoreProvider";

// ─── Component ──────────────────────────────────────────────────

/**
 * Displays recently viewed APIs and tools.
 * Shows an empty state when no items have been viewed.
 */
export function RecentActivity() {
  const { recentViews, isLoaded } = useUserStore();

  if (!isLoaded) {
    return <RecentActivitySkeleton />;
  }

  if (recentViews.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Clock size={32} className="text-text-muted mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-sm font-medium text-text-secondary mb-1">No recent activity</h3>
        <p className="text-xs text-text-muted">
          Items you view will appear here for quick access
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentViews.map((item) => (
        <RecentItem key={item.id} item={item} />
      ))}
    </div>
  );
}

// ─── Recent Item ────────────────────────────────────────────────

function RecentItem({ item }: { item: RecentViewEntry }) {
  const Icon = item.type === "api" ? Layers : Wrench;
  const url = item.type === "api" ? `/apis/${item.slug}` : `/tools/${item.slug}`;
  const accentColor = item.type === "api" ? "text-accent" : "text-emerald-400";

  const timeAgo = getTimeAgo(item.viewedAt);

  return (
    <Link
      href={url}
      className="
        flex items-center gap-3 px-4 py-3
        bg-white/[0.02] border border-white/[0.06]
        rounded-lg
        hover:bg-white/[0.04] hover:border-white/[0.10]
        transition-all duration-200 group
      "
    >
      <div className={`
        w-8 h-8 rounded-md flex items-center justify-center
        ${item.type === "api" ? "bg-accent/10" : "bg-emerald-500/10"}
      `}>
        <Icon size={14} className={accentColor} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
        <p className="text-xs text-text-muted">{item.category} · {timeAgo}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </Link>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function RecentActivitySkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] rounded-lg animate-pulse">
          <div className="w-8 h-8 rounded-md bg-white/[0.06]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 bg-white/[0.06] rounded" />
            <div className="h-2.5 w-20 bg-white/[0.04] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Time Utility ───────────────────────────────────────────────

function getTimeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
