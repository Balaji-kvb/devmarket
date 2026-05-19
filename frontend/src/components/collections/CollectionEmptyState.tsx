"use client";

import { FolderPlus, ArrowRight } from "lucide-react";

// ─── Component ──────────────────────────────────────────────────

/**
 * Empty state shown when user has no collections.
 */
export function CollectionEmptyState({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <div className="glass-card p-10 text-center">
      <div className="
        w-14 h-14 mx-auto mb-4
        flex items-center justify-center
        bg-gradient-to-br from-amber-500/15 to-orange-500/15
        rounded-2xl text-amber-400
      ">
        <FolderPlus size={28} />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        No collections yet
      </h3>
      <p className="text-sm text-text-muted mb-5 max-w-xs mx-auto">
        Organize your favorite APIs and tools into custom collections
        for quick access
      </p>
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="
            inline-flex items-center gap-2
            h-9 px-5
            bg-accent text-white
            rounded-lg
            text-sm font-medium
            hover:bg-accent/90
            transition-all duration-200
          "
        >
          <FolderPlus size={14} />
          Create your first collection
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}
