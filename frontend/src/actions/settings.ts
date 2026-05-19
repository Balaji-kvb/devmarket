"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { NotificationSettings, ThemePreference, SocialLinks } from "@/lib/profile";
import { getUserExportData } from "@/lib/settings";

export interface UpdateSettingsData {
  themePreference: ThemePreference;
  notificationSettings: NotificationSettings;
  socialLinks: SocialLinks;
}

export async function updateUserSettings(data: UpdateSettingsData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        themePreference: data.themePreference,
        notificationSettings: data.notificationSettings as unknown as Prisma.InputJsonValue,
        socialLinks: Object.keys(data.socialLinks).length
          ? (data.socialLinks as unknown as Prisma.InputJsonValue)
          : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Unable to save preferences." };
  }
}

export async function exportUserData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await getUserExportData(session.user.id);
}

export async function requestAccountDeletion() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Authentication required." };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Unable to delete account." };
  }
}
