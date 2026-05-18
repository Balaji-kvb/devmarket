"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  FolderOpen,
  Globe,
  Lock,
  Layers,
  Wrench,
  ArrowLeft,
  Trash2,
  Share2,
} from "lucide-react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useToast } from "@/providers/ToastProvider";

// ─── Component ──────────────────────────────────────────────────

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getCollectionBySlug, removeFromCollection, deleteCollection } = useUserStore();
  const { toast } = useToast();

  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const VisibilityIcon = collection.visibility === "public" ? Globe : Lock;
  const apiItems = collection.items.filter((i) => i.type === "api");
  const toolItems = collection.items.filter((i) => i.type === "tool");

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeFromCollection(collection.id, itemId);
    toast(`Removed ${itemName} from ${collection.title}`, "info");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard", "success");
    } catch {
      toast("Failed to copy link", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="
          inline-flex items-center gap-1.5 mb-6
          text-xs text-text-muted hover:text-text-secondary
          transition-colors
        "
      >
        <ArrowLeft size={12} />
        Back to Dashboard
      </Link>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="
        p-6 lg:p-8 mb-8
        bg-white/[0.02] border border-white/[0.06]
        rounded-2xl
      ">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="
              w-14 h-14 rounded-2xl
              flex items-center justify-center
              bg-gradient-to-br from-amber-500/20 to-orange-500/20
              text-amber-400
            ">
              <FolderOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{collection.title}</h1>
              {collection.description && (
                <p className="text-sm text-text-muted mt-1">{collection.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="
                flex items-center gap-1.5 h-8 px-3
                text-xs text-text-muted
                bg-white/[0.04] border border-white/[0.08]
                rounded-lg
                hover:text-text-secondary hover:border-white/[0.12]
                transition-all duration-200
              "
            >
              <Share2 size={12} />
              Share
            </button>
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex items-center gap-3 mt-5">
          <span className={`
            inline-flex items-center gap-1 px-2.5 py-1
            text-xs font-medium rounded-full
            ${collection.visibility === "public"
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-text-muted bg-white/[0.06]"
            }
          `}>
            <VisibilityIcon size={11} />
            {collection.visibility}
          </span>
          <span className="text-xs text-text-muted">
            {collection.items.length} item{collection.items.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-text-muted">
            Updated {new Date(collection.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* ── Items ────────────────────────────────────────────── */}
      {collection.items.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <FolderOpen size={32} className="text-text-muted mx-auto mb-3" />
          <h3 className="text-sm font-medium text-text-secondary mb-1">
            This collection is empty
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Browse APIs and tools to add items to this collection
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/apis"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <Layers size={12} /> Browse APIs
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Wrench size={12} /> Browse Tools
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* APIs section */}
          {apiItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">
                  APIs <span className="text-text-muted font-normal">({apiItems.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {apiItems.map((item) => (
                  <CollectionItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemoveItem(item.id, item.name)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tools section */}
          {toolItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Wrench size={14} className="text-emerald-400" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Tools <span className="text-text-muted font-normal">({toolItems.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {toolItems.map((item) => (
                  <CollectionItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemoveItem(item.id, item.name)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Item Card ──────────────────────────────────────────────────

function CollectionItemCard({
  item,
  onRemove,
}: {
  item: { id: string; type: "api" | "tool"; name: string; slug: string; category: string; addedAt: string };
  onRemove: () => void;
}) {
  const Icon = item.type === "api" ? Layers : Wrench;
  const url = item.type === "api" ? `/apis/${item.slug}` : `/tools/${item.slug}`;
  const accentColor = item.type === "api"
    ? "text-accent bg-accent/10"
    : "text-emerald-400 bg-emerald-500/10";

  return (
    <div className="
      group relative flex items-center gap-3 p-4
      bg-white/[0.02] border border-white/[0.06]
      rounded-xl
      hover:bg-white/[0.04] hover:border-white/[0.10]
      transition-all duration-200
    ">
      <Link href={url} className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accentColor}`}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
          <p className="text-xs text-text-muted">{item.category}</p>
        </div>
      </Link>

      <button
        onClick={onRemove}
        className="
          flex items-center justify-center
          w-7 h-7 rounded-md shrink-0
          text-text-muted opacity-0 group-hover:opacity-100
          hover:text-red-400 hover:bg-red-500/10
          transition-all duration-200
        "
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
