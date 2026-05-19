"use client";

import Link from "next/link";
import { FolderOpen, Globe, Lock, Layers, Wrench, Trash2 } from "lucide-react";
import type { CollectionEntry } from "@/providers/UserStoreProvider";

// ─── Types ──────────────────────────────────────────────────────

interface CollectionCardProps {
  collection: CollectionEntry;
  onDelete?: (id: string) => void;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Card displaying a single collection with item count, avatars,
 * visibility badge, and relative timestamp.
 */
export function CollectionCard({ collection, onDelete }: CollectionCardProps) {
  const apiCount = collection.items.filter((i) => i.type === "api").length;
  const toolCount = collection.items.filter((i) => i.type === "tool").length;
  const VisibilityIcon = collection.visibility === "public" ? Globe : Lock;
  const previewItems = collection.items.slice(0, 4);

  return (
    <div className="
      group relative flex flex-col
      p-5 bg-white/[0.02] border border-white/[0.06]
      rounded-2xl
      hover:bg-white/[0.04] hover:border-white/[0.10]
      hover:shadow-lg hover:shadow-accent/5
      transition-all duration-300
    ">
      <Link href={`/collections/${collection.slug}`} className="flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="
            w-10 h-10 rounded-xl
            flex items-center justify-center
            bg-gradient-to-br from-amber-500/20 to-orange-500/20
            text-amber-400
          ">
            <FolderOpen size={18} />
          </div>
          <span className={`
            inline-flex items-center gap-1 px-2 py-0.5
            text-[10px] font-medium uppercase tracking-wider
            rounded-full
            ${collection.visibility === "public"
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-text-muted bg-white/[0.06]"
            }
          `}>
            <VisibilityIcon size={10} />
            {collection.visibility}
          </span>
        </div>

        {/* Title + description */}
        <h3 className="text-sm font-semibold text-text-primary mb-1 line-clamp-1">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-xs text-text-muted mb-4 line-clamp-2">
            {collection.description}
          </p>
        )}

        {/* Preview avatars */}
        {previewItems.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {previewItems.map((item) => {
              const Icon = item.type === "api" ? Layers : Wrench;
              const color = item.type === "api" ? "bg-accent/15 text-accent" : "bg-emerald-500/15 text-emerald-400";
              return (
                <div
                  key={item.id}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold ${color}`}
                  title={item.name}
                >
                  <Icon size={12} />
                </div>
              );
            })}
            {collection.items.length > 4 && (
              <span className="text-[10px] text-text-muted ml-1">
                +{collection.items.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          {apiCount > 0 && (
            <span className="flex items-center gap-1">
              <Layers size={10} className="text-accent" /> {apiCount} API{apiCount > 1 ? "s" : ""}
            </span>
          )}
          {toolCount > 0 && (
            <span className="flex items-center gap-1">
              <Wrench size={10} className="text-emerald-400" /> {toolCount} tool{toolCount > 1 ? "s" : ""}
            </span>
          )}
          {collection.items.length === 0 && <span>Empty collection</span>}
          <span className="ml-auto">
            {new Date(collection.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </Link>

      {/* Delete button (on hover) */}
      {onDelete && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete(collection.id); }}
          className="
            absolute top-3 right-3
            flex items-center justify-center
            w-7 h-7 rounded-lg
            text-text-muted opacity-0 group-hover:opacity-100
            hover:text-red-400 hover:bg-red-500/10
            transition-all duration-200
          "
          aria-label={`Delete ${collection.title}`}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
