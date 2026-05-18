"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { SocialLinks } from "@/lib/profile";

export interface UpdateProfileData {
  name: string;
  username?: string;
  bio?: string;
  website?: string;
  image?: string;
  socialLinks: SocialLinks;
}

export async function updateUserProfile(data: UpdateProfileData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name || undefined,
        username: data.username || undefined,
        bio: data.bio || undefined,
        website: data.website || undefined,
        image: data.image || undefined,
        socialLinks: Object.keys(data.socialLinks).length
          ? (data.socialLinks as Prisma.InputJsonValue)
          : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Unable to update profile." };
  }
}
