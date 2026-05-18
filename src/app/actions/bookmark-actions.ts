"use server";

/**
 * Bookmark Server Actions
 *
 * All bookmark operations persist to PostgreSQL via Prisma.
 * Each action validates the session before mutating data.
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ─── Types (serializable for client) ────────────────────────────

export interface BookmarkData {
  id: string;
  type: "api" | "tool";
  slug: string;
  name: string;
  category: string;
  createdAt: string;
}

// ─── Actions ────────────────────────────────────────────────────

export async function getBookmarks(): Promise<BookmarkData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return bookmarks.map((b) => ({
      id: b.id,
      type: b.type as "api" | "tool",
      slug: b.slug,
      name: b.name,
      category: b.category,
      createdAt: b.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function addBookmark(data: {
  type: "api" | "tool";
  slug: string;
  name: string;
  category: string;
}): Promise<BookmarkData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        type: data.type,
        slug: data.slug,
        name: data.name,
        category: data.category,
      },
    });

    return {
      id: bookmark.id,
      type: bookmark.type as "api" | "tool",
      slug: bookmark.slug,
      name: bookmark.name,
      category: bookmark.category,
      createdAt: bookmark.createdAt.toISOString(),
    };
  } catch {
    // Likely a duplicate — return null
    return null;
  }
}

export async function removeBookmark(bookmarkId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  try {
    await prisma.bookmark.deleteMany({
      where: { id: bookmarkId, userId: session.user.id },
    });
    return true;
  } catch {
    return false;
  }
}

export async function isBookmarkedBySlug(
  type: "api" | "tool",
  slug: string
): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: session.user.id, type, slug },
      select: { id: true },
    });
    return bookmark?.id ?? null;
  } catch {
    return null;
  }
}
