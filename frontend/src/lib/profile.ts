import { prisma } from "@/lib/db";

export type ThemePreference = "dark" | "light" | "system";

export interface NotificationSettings {
  productUpdates: boolean;
  newsletter: boolean;
  recommendations: boolean;
  securityAlerts: boolean;
}

export interface SocialLinks {
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  image?: string;
  username?: string;
  bio?: string;
  website?: string;
  socialLinks: SocialLinks;
  themePreference: ThemePreference;
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const user = await prisma.user.findUnique({
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

  if (!user) return null;

  const socialLinks = (user.socialLinks ?? {}) as unknown as SocialLinks;
  const notificationSettings = (user.notificationSettings ?? {
    productUpdates: false,
    newsletter: false,
    recommendations: false,
    securityAlerts: false,
  }) as unknown as NotificationSettings;

  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    image: user.image ?? undefined,
    username: user.username ?? undefined,
    bio: user.bio ?? undefined,
    website: user.website ?? undefined,
    socialLinks,
    themePreference: (user.themePreference ?? "system") as ThemePreference,
    notificationSettings,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}
