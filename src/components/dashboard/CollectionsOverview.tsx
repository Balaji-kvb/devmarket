"use client";

import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { CollectionCard } from "@/components/collections/CollectionCard";

// ─── Component ──────────────────────────────────────────────────

/**
 * Dashboard overview of user's collections.
 * Shows top 3 collections with a "View all" link.
 */
export function CollectionsOverview({ onCreateNew }: { onCreateNew: () => void }) {
  const { collections, deleteCollection, isLoaded } = useUserStore();

  if (!isLoaded) {
    return <CollectionsOverviewSkeleton />;
  }

  if (collections.length === 0) {
    return (
      <div className="
        glass-card p-6 text-center
        border-dashed border-white/[0.08]
      ">
        <FolderOpen size={28} className="text-amber-400/50 mx-auto mb-2" aria-hidden="true" />
        <h3 className="text-sm font-medium text-text-secondary mb-1">
          Organize your workspace
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Create collections to group APIs and tools by project or stack
        </p>
        <button
          onClick={onCreateNew}
          className="
            inline-flex items-center gap-1.5
            text-xs font-medium text-amber-400
            hover:text-amber-300 transition-colors
          "
        >
          Create a collection <ArrowRight size={12} />
        </button>
      </div>
    );
  }

  const displayedCollections = collections.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedCollections.map((col) => (
          <CollectionCard key={col.id} collection={col} onDelete={deleteCollection} />
        ))}
      </div>

      {collections.length > 3 && (
        <div className="text-center pt-1">
          <Link
            href="/dashboard"
            onClick={() => {/* switch to collections tab if needed */}}
            className="
              inline-flex items-center gap-1.5
              text-xs font-medium text-text-muted
              hover:text-text-secondary transition-colors
            "
          >
            View all {collections.length} collections <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function CollectionsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="p-5 bg-white/[0.02] rounded-2xl animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
            <div className="h-4 w-14 bg-white/[0.04] rounded-full" />
          </div>
          <div className="h-4 w-32 bg-white/[0.06] rounded mb-1" />
          <div className="h-3 w-48 bg-white/[0.04] rounded mb-4" />
          <div className="flex gap-1">
            <div className="w-7 h-7 rounded-md bg-white/[0.06]" />
            <div className="w-7 h-7 rounded-md bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}
