"use client";

import { useState, useEffect, useRef } from "react";
import { X, Check, Plus } from "lucide-react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useToast } from "@/providers/ToastProvider";

// ─── Types ──────────────────────────────────────────────────────

interface CollectionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    type: "api" | "tool";
    name: string;
    slug: string;
    category: string;
  };
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Picker modal to add an item to one or more collections.
 * Shows existing collections with checkmarks and a "Create new" option.
 */
export function CollectionPicker({ isOpen, onClose, item }: CollectionPickerProps) {
  const {
    collections,
    addToCollection,
    removeFromCollection,
    isInCollection,
    createCollection,
  } = useUserStore();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const itemCollections = isInCollection(item.slug, item.type);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus create input
  useEffect(() => {
    if (showCreate) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [showCreate]);

  if (!isOpen) return null;

  const handleToggle = (collectionId: string, collectionTitle: string) => {
    const isIn = itemCollections.includes(collectionId);
    if (isIn) {
      // Find the item ID in this collection
      const col = collections.find((c) => c.id === collectionId);
      const colItem = col?.items.find((i) => i.slug === item.slug && i.type === item.type);
      if (colItem) {
        removeFromCollection(collectionId, colItem.id);
        toast(`Removed ${item.name} from ${collectionTitle}`, "info");
      }
    } else {
      addToCollection(collectionId, {
        id: item.id,
        type: item.type,
        name: item.name,
        slug: item.slug,
        category: item.category,
      });
      toast(`Added ${item.name} to ${collectionTitle}`, "success");
    }
  };

  const handleCreateAndAdd = () => {
    if (!newTitle.trim()) return;
    const col = createCollection(newTitle.trim(), "", "private");
    addToCollection(col.id, {
      id: item.id,
      type: item.type,
      name: item.name,
      slug: item.slug,
      category: item.category,
    });
    toast(`Created "${col.title}" and added ${item.name}`, "success");
    setNewTitle("");
    setShowCreate(false);
  };

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
      "
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Save ${item.name} to collection`}
    >
      <div className="
        w-full max-w-sm mx-4
        bg-[#0f1117] border border-white/[0.10]
        rounded-2xl shadow-2xl shadow-black/40
        overflow-hidden
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Save to collection</h2>
            <p className="text-xs text-text-muted mt-0.5">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Collection list */}
        <div className="px-3 pb-2 max-h-64 overflow-y-auto" role="listbox" aria-label="Collections">
          {collections.length === 0 && !showCreate && (
            <p className="text-xs text-text-muted text-center py-4">
              No collections yet. Create one below.
            </p>
          )}
          {collections.map((col) => {
            const isIn = itemCollections.includes(col.id);
            return (
              <button
                key={col.id}
                onClick={() => handleToggle(col.id, col.title)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  rounded-lg text-left
                  transition-all duration-150
                  ${isIn
                    ? "bg-accent/10 text-text-primary"
                    : "hover:bg-white/[0.04] text-text-secondary"
                  }
                `}
                role="option"
                aria-selected={isIn}
              >
                <div className={`
                  w-5 h-5 rounded-md flex items-center justify-center
                  border transition-all duration-150
                  ${isIn
                    ? "bg-accent border-accent text-white"
                    : "border-white/[0.12] bg-transparent"
                  }
                `}>
                  {isIn && <Check size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{col.title}</p>
                  <p className="text-[11px] text-text-muted">
                    {col.items.length} item{col.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Create new inline */}
        <div className="px-3 pb-4">
          {showCreate ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateAndAdd(); }}
                placeholder="Collection name…"
                maxLength={60}
                className="
                  flex-1 h-9 px-3
                  bg-white/[0.04] border border-white/[0.08]
                  rounded-lg text-sm text-text-primary
                  placeholder:text-text-muted
                  outline-none focus:border-accent/50
                  transition-all duration-200
                "
              />
              <button
                onClick={handleCreateAndAdd}
                disabled={!newTitle.trim()}
                className="
                  h-9 px-3 rounded-lg
                  bg-accent text-white text-sm font-medium
                  hover:bg-accent/90
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="
                w-full flex items-center justify-center gap-2
                h-9 rounded-lg
                text-sm text-text-muted
                border border-dashed border-white/[0.10]
                hover:text-text-secondary hover:border-white/[0.16]
                transition-all duration-200
              "
            >
              <Plus size={14} />
              Create new collection
            </button>
          )}
        </div>

        {/* Done button */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="
              w-full h-9
              bg-white/[0.06] border border-white/[0.08]
              rounded-lg text-sm font-medium text-text-secondary
              hover:bg-white/[0.10]
              transition-all duration-200
            "
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
