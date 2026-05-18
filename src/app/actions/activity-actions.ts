"use server";

/**
 * Activity Server Actions
 *
 * Recent view tracking with PostgreSQL persistence.
 * Caps at 20 recent views per user, oldest auto-purged.
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────

export interface RecentViewData {
  id: string;
  type: "api" | "tool";
  slug: string;
  name: string;
  category: string;
  viewedAt: string;
}

const MAX_RECENT_VIEWS = 20;

// ─── Actions ────────────────────────────────────────────────────

export async function getRecentViews(): Promise<RecentViewData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const views = await prisma.recentView.findMany({
      where: { userId: session.user.id },
      orderBy: { viewedAt: "desc" },
      take: MAX_RECENT_VIEWS,
    });

    return views.map((v) => ({
      id: v.id,
      type: v.type as "api" | "tool",
      slug: v.slug,
      name: v.name,
      category: v.category,
      viewedAt: v.viewedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function addRecentView(data: {
  type: "api" | "tool";
  slug: string;
  name: string;
  category: string;
}): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  try {
    // Delete any existing view of this item to move it to the top
    await prisma.recentView.deleteMany({
      where: {
        userId: session.user.id,
        type: data.type,
        slug: data.slug,
      },
    });

    // Create new view entry
    await prisma.recentView.create({
      data: {
        userId: session.user.id,
        type: data.type,
        slug: data.slug,
        name: data.name,
        category: data.category,
      },
    });

    // Purge oldest entries beyond the cap
    const views = await prisma.recentView.findMany({
      where: { userId: session.user.id },
      orderBy: { viewedAt: "desc" },
      skip: MAX_RECENT_VIEWS,
      select: { id: true },
    });

    if (views.length > 0) {
      await prisma.recentView.deleteMany({
        where: { id: { in: views.map((v) => v.id) } },
      });
    }

    return true;
  } catch {
    return false;
  }
}
