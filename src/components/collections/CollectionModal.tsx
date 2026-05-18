"use client";

import { useState, useRef, useEffect } from "react";
import { X, FolderPlus, Globe, Lock } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, visibility: "public" | "private") => void;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Modal for creating a new collection.
 * Focus trap, ESC close, and backdrop click close.
 */
export function CollectionModal({ isOpen, onClose, onCreate }: CollectionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim(), description.trim(), visibility);
    setTitle("");
    setDescription("");
    setVisibility("private");
    onClose();
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
      aria-label="Create new collection"
    >
      <div className="
        w-full max-w-md mx-4
        bg-[#0f1117] border border-white/[0.10]
        rounded-2xl shadow-2xl shadow-black/40
        overflow-hidden
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="
              w-9 h-9 rounded-xl
              flex items-center justify-center
              bg-gradient-to-br from-amber-500/20 to-orange-500/20
              text-amber-400
            ">
              <FolderPlus size={16} />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">New Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="col-title" className="block text-xs font-medium text-text-muted mb-1.5">
              Collection name
            </label>
            <input
              ref={inputRef}
              id="col-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI Stack, DevOps Toolkit"
              required
              maxLength={60}
              className="
                w-full h-10 px-3
                bg-white/[0.04] border border-white/[0.08]
                rounded-lg text-sm text-text-primary
                placeholder:text-text-muted
                outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                transition-all duration-200
              "
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="col-desc" className="block text-xs font-medium text-text-muted mb-1.5">
              Description <span className="text-text-muted/50">(optional)</span>
            </label>
            <textarea
              id="col-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this collection about?"
              maxLength={200}
              rows={2}
              className="
                w-full px-3 py-2
                bg-white/[0.04] border border-white/[0.08]
                rounded-lg text-sm text-text-primary
                placeholder:text-text-muted
                outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                transition-all duration-200 resize-none
              "
            />
          </div>

          {/* Visibility */}
          <div>
            <span className="block text-xs font-medium text-text-muted mb-2">Visibility</span>
            <div className="flex gap-2">
              {(["private", "public"] as const).map((v) => {
                const isActive = visibility === v;
                const Icon = v === "public" ? Globe : Lock;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`
                      flex items-center gap-2 h-9 px-4
                      rounded-lg text-sm font-medium
                      border transition-all duration-200
                      ${isActive
                        ? "bg-white/[0.08] border-white/[0.14] text-text-primary"
                        : "bg-transparent border-white/[0.06] text-text-muted hover:border-white/[0.10]"
                      }
                    `}
                  >
                    <Icon size={13} />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="
              w-full h-10
              bg-accent text-white
              rounded-lg text-sm font-medium
              hover:bg-accent/90
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            Create Collection
          </button>
        </form>
      </div>
    </div>
  );
}
