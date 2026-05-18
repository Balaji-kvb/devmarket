"use client";

import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useToast } from "@/providers/ToastProvider";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────────────────────

interface BookmarkButtonProps {
  id: string;
  type: "api" | "tool";
  name: string;
  slug: string;
  category: string;
  /** Size variant. */
  size?: "sm" | "md";
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Optimistic bookmark toggle button.
 * Shows filled icon when bookmarked, outline when not.
 * Redirects to /login if user is not authenticated.
 * Persists via server actions → PostgreSQL.
 */
export function BookmarkButton({
  id,
  type,
  name,
  slug,
  category,
  size = "sm",
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const { isBookmarked, toggleBookmark } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();

  const saved = isBookmarked(slug, type);
  const iconSize = size === "sm" ? 16 : 20;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/login");
      return;
    }

    toggleBookmark({ id, type, name, slug, category });

    toast(
      saved ? `Removed ${name} from bookmarks` : `Saved ${name} to bookmarks`,
      saved ? "info" : "success"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        rounded-lg transition-all duration-200
        ${size === "sm" ? "w-8 h-8" : "w-10 h-10"}
        ${saved
          ? "text-accent bg-accent/10 hover:bg-accent/20"
          : "text-text-muted hover:text-text-secondary hover:bg-white/[0.06]"
        }
      `}
      aria-label={saved ? `Remove ${name} from bookmarks` : `Save ${name}`}
      title={saved ? "Remove bookmark" : "Save to bookmarks"}
    >
      <Bookmark
        size={iconSize}
        fill={saved ? "currentColor" : "none"}
        className="transition-all duration-200"
      />
    </button>
  );
}
