"use client";

import { CollectionCard } from "./CollectionCard";
import { CollectionEmptyState } from "./CollectionEmptyState";
import type { CollectionEntry } from "@/providers/UserStoreProvider";

// ─── Types ──────────────────────────────────────────────────────

interface CollectionGridProps {
  collections: CollectionEntry[];
  onDelete?: (id: string) => void;
  onCreateNew?: () => void;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Responsive grid of collection cards.
 * 3 cols desktop, 2 cols tablet, 1 col mobile.
 */
export function CollectionGrid({ collections, onDelete, onCreateNew }: CollectionGridProps) {
  if (collections.length === 0) {
    return <CollectionEmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
