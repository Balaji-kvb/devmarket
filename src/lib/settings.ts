import { prisma } from "@/lib/db";
import type { ThemePreference, NotificationSettings, SocialLinks, UserProfileData } from "./profile";

export interface ConnectedAccountData {
  id: string;
  provider: string;
  type: string;
  providerAccountId: string;
  createdAt: string;
}

export interface UserStats {
  collections: number;
  savedAPIs: number;
  savedTools: number;
  recentActivity: number;
}

export interface UserExportData {
  profile: Omit<UserProfileData, "notificationSettings" | "themePreference"> & {
    themePreference: ThemePreference;
    notificationSettings: NotificationSettings;
  };
  bookmarks: Array<{ type: string; slug: string; name: string; category: string; createdAt: string }>;
  collections: Array<{ title: string; description?: string; visibility: string; createdAt: string }>; 
  preferences: {
    themePreference: ThemePreference;
    notificationSettings: NotificationSettings;
    socialLinks: SocialLinks;
  };
}

export async function getConnectedAccounts(userId: string): Promise<ConnectedAccountData[]> {
  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { provider: "asc" },
  });

  return accounts.map((account) => ({
    id: account.id,
    provider: account.provider,
    type: account.type,
    providerAccountId: account.providerAccountId,
    createdAt: account.expires_at ? new Date(account.expires_at * 1000).toISOString() : new Date().toISOString(),
  }));
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const [collections, savedAPIs, savedTools, recentActivity] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.bookmark.count({ where: { userId, type: "api" } }),
    prisma.bookmark.count({ where: { userId, type: "tool" } }),
    prisma.recentView.count({ where: { userId } }),
  ]);

  return {
    collections,
    savedAPIs,
    savedTools,
    recentActivity,
  };
}

export async function getRecentActivity(userId: string) {
  const recent = await prisma.recentView.findMany({
    where: { userId },
    orderBy: { viewedAt: "desc" },
    take: 6,
  });

  return recent.map((entry) => ({
    id: entry.id,
    name: entry.name,
    type: entry.type,
    category: entry.category,
    viewedAt: entry.viewedAt.toISOString(),
  }));
}

export async function getUserExportData(userId: string): Promise<UserExportData | null> {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      website: true,
      socialLinks: true,
      themePreference: true,
      notificationSettings: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!profile) return null;

  const socialLinks = (profile.socialLinks ?? {}) as unknown as SocialLinks;
  const notificationSettings = (profile.notificationSettings ?? {
    productUpdates: false,
    newsletter: false,
    recommendations: false,
    securityAlerts: false,
  }) as unknown as NotificationSettings;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    select: { type: true, slug: true, name: true, category: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const collections = await prisma.collection.findMany({
    where: { userId },
    select: { title: true, description: true, visibility: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    profile: {
      id: profile.id,
      name: profile.name || "",
      email: profile.email,
      image: profile.image ?? undefined,
      username: profile.username ?? undefined,
      bio: profile.bio ?? undefined,
      website: profile.website ?? undefined,
      socialLinks,
      themePreference: (profile.themePreference ?? "system") as ThemePreference,
      notificationSettings,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt?.toISOString(),
    },
    bookmarks: bookmarks.map((item) => ({
      type: item.type,
      slug: item.slug,
      name: item.name,
      category: item.category,
      createdAt: item.createdAt.toISOString(),
    })),
    collections: collections.map((item) => ({
      title: item.title,
      description: item.description ?? undefined,
      visibility: item.visibility,
      createdAt: item.createdAt.toISOString(),
    })),
    preferences: {
      themePreference: (profile.themePreference ?? "system") as ThemePreference,
      notificationSettings,
      socialLinks,
    },
  };
}

export async function markAccountForDeletion(userId: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    return true;
  } catch {
    return false;
  }
}
