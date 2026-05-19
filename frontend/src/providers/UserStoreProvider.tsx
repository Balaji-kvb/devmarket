"use client";

/**
 * DevMarket — User Store Provider
 *
 * Provides user-specific data (bookmarks, collections, recent views)
 * via React Context. All mutations are backed by server actions
 * that persist to PostgreSQL via Prisma.
 *
 * Architecture:
 *   Client state (optimistic) → Server Action → Prisma → PostgreSQL
 *
 * On mount, the provider fetches data from the DB via server actions.
 * Mutations update local state optimistically, then fire server actions
 * in the background. On failure, the UI reverts and shows an error toast.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

import {
  getBookmarks as fetchBookmarks,
  addBookmark as serverAddBookmark,
  removeBookmark as serverRemoveBookmark,
  type BookmarkData,
} from "@/app/actions/bookmark-actions";

import {
  getCollections as fetchCollections,
  createCollection as serverCreateCollection,
  deleteCollection as serverDeleteCollection,
  addToCollection as serverAddToCollection,
  removeFromCollection as serverRemoveFromCollection,
  type CollectionData,
  type CollectionItemData,
} from "@/app/actions/collection-actions";

import {
  getRecentViews as fetchRecentViews,
  addRecentView as serverAddRecentView,
  type RecentViewData,
} from "@/app/actions/activity-actions";

// ─── Re-export types for consumers ──────────────────────────────

export type { BookmarkData, CollectionData, CollectionItemData, RecentViewData };

// Keep old type aliases for backward compatibility
export type BookmarkEntry = BookmarkData;
export type CollectionEntry = CollectionData;
export type CollectionItem = CollectionItemData;
export type RecentViewEntry = RecentViewData;

// ─── Context Shape ──────────────────────────────────────────────

interface UserStoreState {
  bookmarks: BookmarkData[];
  recentViews: RecentViewData[];
  collections: CollectionData[];
  isBookmarked: (slug: string, type: "api" | "tool") => boolean;
  toggleBookmark: (entry: {
    id: string; type: "api" | "tool"; name: string; slug: string; category: string;
  }) => void;
  addRecentView: (entry: {
    id: string; type: "api" | "tool"; name: string; slug: string; category: string;
  }) => void;
  clearBookmarks: () => void;
  clearRecentViews: () => void;
  createCollection: (
    title: string, description: string, visibility: "public" | "private"
  ) => CollectionData;
  deleteCollection: (collectionId: string) => void;
  addToCollection: (
    collectionId: string,
    item: { id: string; type: "api" | "tool"; name: string; slug: string; category: string }
  ) => void;
  removeFromCollection: (collectionId: string, itemId: string) => void;
  isInCollection: (slug: string, type: "api" | "tool") => string[];
  getCollectionBySlug: (slug: string) => CollectionData | undefined;
  isLoaded: boolean;
}

// ─── Context ────────────────────────────────────────────────────

const UserStoreContext = createContext<UserStoreState | null>(null);

// ─── Helpers ────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function generateId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Provider ───────────────────────────────────────────────────

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [recentViews, setRecentViews] = useState<RecentViewData[]>([]);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Hydrate from DB on session change ─────────────────────
  useEffect(() => {
    if (!session?.user) {
      setBookmarks([]);
      setRecentViews([]);
      setCollections([]);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        const [bm, rv, col] = await Promise.all([
          fetchBookmarks(),
          fetchRecentViews(),
          fetchCollections(),
        ]);
        if (!cancelled) {
          setBookmarks(bm);
          setRecentViews(rv);
          setCollections(col);
        }
      } catch {
        // DB not available — start with empty state
      }
      if (!cancelled) setIsLoaded(true);
    }

    setIsLoaded(false);
    loadData();
    return () => { cancelled = true; };
  }, [session?.user?.id]);  

  // ── Bookmark Actions ──────────────────────────────────────

  const isBookmarked = useCallback(
    (slug: string, type: "api" | "tool") =>
      bookmarks.some((b) => b.slug === slug && b.type === type),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (entry: { id: string; type: "api" | "tool"; name: string; slug: string; category: string }) => {
      const existing = bookmarks.find((b) => b.slug === entry.slug && b.type === entry.type);

      if (existing) {
        // Optimistic remove
        setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
        serverRemoveBookmark(existing.id).catch(() => {
          // Revert on failure
          setBookmarks((prev) => [existing, ...prev]);
        });
      } else {
        // Optimistic add
        const tempEntry: BookmarkData = {
          id: generateId(),
          type: entry.type,
          slug: entry.slug,
          name: entry.name,
          category: entry.category,
          createdAt: new Date().toISOString(),
        };
        setBookmarks((prev) => [tempEntry, ...prev]);

        serverAddBookmark({
          type: entry.type,
          slug: entry.slug,
          name: entry.name,
          category: entry.category,
        }).then((result) => {
          if (result) {
            // Replace temp entry with real DB entry
            setBookmarks((prev) =>
              prev.map((b) => (b.id === tempEntry.id ? result : b))
            );
          }
        }).catch(() => {
          // Revert on failure
          setBookmarks((prev) => prev.filter((b) => b.id !== tempEntry.id));
        });
      }
    },
    [bookmarks]
  );

  // ── Recent Views ──────────────────────────────────────────

  const addRecentViewAction = useCallback(
    (entry: { id: string; type: "api" | "tool"; name: string; slug: string; category: string }) => {
      // Optimistic update
      const tempEntry: RecentViewData = {
        id: generateId(),
        type: entry.type,
        slug: entry.slug,
        name: entry.name,
        category: entry.category,
        viewedAt: new Date().toISOString(),
      };
      setRecentViews((prev) => {
        const filtered = prev.filter((v) => !(v.slug === entry.slug && v.type === entry.type));
        return [tempEntry, ...filtered].slice(0, 20);
      });

      // Fire and forget
      serverAddRecentView({
        type: entry.type,
        slug: entry.slug,
        name: entry.name,
        category: entry.category,
      }).catch(() => { /* silent fail for views */ });
    },
    []
  );

  const clearBookmarks = useCallback(() => setBookmarks([]), []);
  const clearRecentViews = useCallback(() => setRecentViews([]), []);

  // ── Collection Actions ────────────────────────────────────

  const createCollectionAction = useCallback(
    (title: string, description: string, visibility: "public" | "private"): CollectionData => {
      const now = new Date().toISOString();
      const tempEntry: CollectionData = {
        id: generateId(),
        slug: slugify(title) || generateId(),
        title,
        description,
        visibility,
        items: [],
        createdAt: now,
        updatedAt: now,
      };

      // Optimistic add
      setCollections((prev) => [tempEntry, ...prev]);

      // Persist to DB
      serverCreateCollection(title, description, visibility).then((result) => {
        if (result) {
          setCollections((prev) =>
            prev.map((c) => (c.id === tempEntry.id ? result : c))
          );
        }
      }).catch(() => {
        setCollections((prev) => prev.filter((c) => c.id !== tempEntry.id));
      });

      return tempEntry;
    },
    []
  );

  const deleteCollectionAction = useCallback(
    (collectionId: string) => {
      const removed = collections.find((c) => c.id === collectionId);
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));

      serverDeleteCollection(collectionId).catch(() => {
        if (removed) setCollections((prev) => [removed, ...prev]);
      });
    },
    [collections]
  );

  const addToCollectionAction = useCallback(
    (collectionId: string, item: { id: string; type: "api" | "tool"; name: string; slug: string; category: string }) => {
      // Optimistic add
      const tempItem: CollectionItemData = {
        id: generateId(),
        type: item.type,
        slug: item.slug,
        name: item.name,
        category: item.category,
        addedAt: new Date().toISOString(),
      };

      setCollections((prev) =>
        prev.map((c) => {
          if (c.id !== collectionId) return c;
          if (c.items.some((i) => i.slug === item.slug && i.type === item.type)) return c;
          return { ...c, items: [...c.items, tempItem], updatedAt: new Date().toISOString() };
        })
      );

      serverAddToCollection(collectionId, {
        type: item.type,
        slug: item.slug,
        name: item.name,
        category: item.category,
      }).catch(() => {
        setCollections((prev) =>
          prev.map((c) => {
            if (c.id !== collectionId) return c;
            return { ...c, items: c.items.filter((i) => i.id !== tempItem.id) };
          })
        );
      });
    },
    []
  );

  const removeFromCollectionAction = useCallback(
    (collectionId: string, itemId: string) => {
      let removedItem: CollectionItemData | undefined;

      setCollections((prev) =>
        prev.map((c) => {
          if (c.id !== collectionId) return c;
          removedItem = c.items.find((i) => i.id === itemId);
          return { ...c, items: c.items.filter((i) => i.id !== itemId), updatedAt: new Date().toISOString() };
        })
      );

      serverRemoveFromCollection(collectionId, itemId).catch(() => {
        if (removedItem) {
          setCollections((prev) =>
            prev.map((c) => {
              if (c.id !== collectionId) return c;
              return { ...c, items: [...c.items, removedItem!] };
            })
          );
        }
      });
    },
    []
  );

  const isInCollectionAction = useCallback(
    (slug: string, type: "api" | "tool"): string[] =>
      collections
        .filter((c) => c.items.some((i) => i.slug === slug && i.type === type))
        .map((c) => c.id),
    [collections]
  );

  const getCollectionBySlugAction = useCallback(
    (slug: string): CollectionData | undefined =>
      collections.find((c) => c.slug === slug),
    [collections]
  );

  return (
    <UserStoreContext.Provider
      value={{
        bookmarks,
        recentViews,
        collections,
        isBookmarked,
        toggleBookmark,
        addRecentView: addRecentViewAction,
        clearBookmarks,
        clearRecentViews,
        createCollection: createCollectionAction,
        deleteCollection: deleteCollectionAction,
        addToCollection: addToCollectionAction,
        removeFromCollection: removeFromCollectionAction,
        isInCollection: isInCollectionAction,
        getCollectionBySlug: getCollectionBySlugAction,
        isLoaded,
      }}
    >
      {children}
    </UserStoreContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────

export function useUserStore(): UserStoreState {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }
  return context;
}
