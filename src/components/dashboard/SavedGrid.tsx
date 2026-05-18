"use client";

import Link from "next/link";
import { Bookmark, Layers, Wrench, ArrowRight, Trash2 } from "lucide-react";
import { useUserStore, type BookmarkEntry } from "@/providers/UserStoreProvider";
import { useToast } from "@/providers/ToastProvider";

// ─── Types ──────────────────────────────────────────────────────

interface SavedGridProps {
  /** Filter by type. If omitted, shows all. */
  filterType?: "api" | "tool";
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Responsive grid of saved/bookmarked items.
 * Supports filtering by type and includes a remove button.
 */
export function SavedGrid({ filterType }: SavedGridProps) {
  const { bookmarks, toggleBookmark, isLoaded } = useUserStore();
  const { toast } = useToast();

  if (!isLoaded) {
    return <SavedGridSkeleton />;
  }

  const items = filterType
    ? bookmarks.filter((b) => b.type === filterType)
    : bookmarks;

  if (items.length === 0) {
    const typeLabel = filterType === "api" ? "APIs" : filterType === "tool" ? "tools" : "items";
    return (
      <div className="glass-card p-8 text-center">
        <Bookmark size={32} className="text-text-muted mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-sm font-medium text-text-secondary mb-1">
          No saved {typeLabel}
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Bookmark {typeLabel} to access them quickly from your dashboard
        </p>
        <Link
          href={filterType === "tool" ? "/tools" : "/apis"}
          className="
            inline-flex items-center gap-1.5
            text-xs font-medium text-accent
            hover:text-accent/80 transition-colors
          "
        >
          Browse {typeLabel} <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  const handleRemove = (item: BookmarkEntry) => {
    toggleBookmark({ id: item.id, type: item.type, name: item.name, slug: item.slug, category: item.category });
    toast(`Removed ${item.name} from bookmarks`, "info");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <SavedCard key={item.id} item={item} onRemove={handleRemove} />
      ))}
    </div>
  );
}

// ─── Saved Card ─────────────────────────────────────────────────

function SavedCard({
  item,
  onRemove,
}: {
  item: BookmarkEntry;
  onRemove: (item: BookmarkEntry) => void;
}) {
  const Icon = item.type === "api" ? Layers : Wrench;
  const url = item.type === "api" ? `/apis/${item.slug}` : `/tools/${item.slug}`;
  const accentColor = item.type === "api" ? "text-accent bg-accent/10" : "text-emerald-400 bg-emerald-500/10";

  return (
    <div className="
      group relative
      flex flex-col gap-3 p-4
      bg-white/[0.02] border border-white/[0.06]
      rounded-xl
      hover:bg-white/[0.04] hover:border-white/[0.10]
      transition-all duration-200
    ">
      <Link href={url} className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accentColor}`}>
          <Icon size={16} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item)}
        className="
          absolute top-3 right-3
          flex items-center justify-center
          w-7 h-7 rounded-md
          text-text-muted opacity-0 group-hover:opacity-100
          hover:text-red-400 hover:bg-red-500/10
          transition-all duration-200
        "
        aria-label={`Remove ${item.name} from bookmarks`}
      >
        <Trash2 size={13} />
      </button>

      {/* Saved date */}
      <p className="text-[10px] text-text-muted font-mono">
        Saved {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function SavedGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-3 p-4 bg-white/[0.02] rounded-xl animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.06]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-white/[0.06] rounded" />
              <div className="h-2.5 w-16 bg-white/[0.04] rounded" />
            </div>
          </div>
          <div className="h-2 w-20 bg-white/[0.04] rounded" />
        </div>
      ))}
    </div>
  );
}
