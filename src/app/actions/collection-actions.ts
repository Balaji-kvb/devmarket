"use server";

/**
 * Collection Server Actions
 *
 * All collection operations persist to PostgreSQL via Prisma.
 * Each action validates the session before mutating data.
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ─── Types (serializable for client) ────────────────────────────

export interface CollectionItemData {
  id: string;
  type: "api" | "tool";
  slug: string;
  name: string;
  category: string;
  addedAt: string;
}

export interface CollectionData {
  id: string;
  slug: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  items: CollectionItemData[];
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapCollection(c: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    type: string;
    slug: string;
    name: string;
    category: string;
    addedAt: Date;
  }[];
}): CollectionData {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description ?? "",
    visibility: c.visibility as "public" | "private",
    items: c.items.map((i) => ({
      id: i.id,
      type: i.type as "api" | "tool",
      slug: i.slug,
      name: i.name,
      category: i.category,
      addedAt: i.addedAt.toISOString(),
    })),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

// ─── Actions ────────────────────────────────────────────────────

export async function getCollections(): Promise<CollectionData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const collections = await prisma.collection.findMany({
      where: { userId: session.user.id },
      include: { items: { orderBy: { addedAt: "desc" } } },
      orderBy: { updatedAt: "desc" },
    });

    return collections.map(mapCollection);
  } catch {
    return [];
  }
}

export async function createCollection(
  title: string,
  description: string,
  visibility: "public" | "private"
): Promise<CollectionData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const baseSlug = slugify(title) || `col-${Date.now()}`;
  // Ensure unique slug
  let slug = baseSlug;
  let counter = 0;
  while (true) {
    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  try {
    const collection = await prisma.collection.create({
      data: {
        userId: session.user.id,
        slug,
        title,
        description: description || null,
        visibility,
      },
      include: { items: true },
    });

    return mapCollection(collection);
  } catch {
    return null;
  }
}

export async function deleteCollection(collectionId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  try {
    await prisma.collection.deleteMany({
      where: { id: collectionId, userId: session.user.id },
    });
    return true;
  } catch {
    return false;
  }
}

export async function addToCollection(
  collectionId: string,
  item: { type: "api" | "tool"; slug: string; name: string; category: string }
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  try {
    // Verify collection belongs to user
    const col = await prisma.collection.findFirst({
      where: { id: collectionId, userId: session.user.id },
    });
    if (!col) return false;

    await prisma.collectionItem.create({
      data: {
        collectionId,
        type: item.type,
        slug: item.slug,
        name: item.name,
        category: item.category,
      },
    });
    return true;
  } catch {
    return false; // Likely a duplicate
  }
}

export async function removeFromCollection(
  collectionId: string,
  itemId: string
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  try {
    // Verify collection belongs to user
    const col = await prisma.collection.findFirst({
      where: { id: collectionId, userId: session.user.id },
    });
    if (!col) return false;

    await prisma.collectionItem.deleteMany({
      where: { id: itemId, collectionId },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getCollectionBySlug(
  slug: string
): Promise<CollectionData | null> {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: { items: { orderBy: { addedAt: "desc" } } },
    });
    if (!collection) return null;
    return mapCollection(collection);
  } catch {
    return null;
  }
}
