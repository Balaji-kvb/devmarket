import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getRecentActivity, getUserStats } from "@/lib/settings";
import { getUserProfile } from "@/lib/profile";
import { ProfileActivityCard } from "@/components/profile/ProfileActivityCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";

export const metadata: Metadata = {
  title: "Profile — DevMarket",
  description: "View your DevMarket profile, activity, and saved collections in one place.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">Profile</p>
        <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">Sign in to review your activity</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary">
          Your profile dashboard shows saved collections, bookmarked tools, and recent developer activity.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const profile = await getUserProfile(session.user.id);
  const stats = await getUserStats(session.user.id);
  const activity = await getRecentActivity(session.user.id);

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-400">Profile not found</p>
        <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">Unable to load your profile dashboard</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary">
          Refresh the page or sign out and sign back in to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-text-primary sm:text-4xl">Your DevMarket dashboard</h1>
              <p className="max-w-2xl text-sm text-text-secondary">
                Review your saved collections, connection status, and developer activity at a glance.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/settings"
                className="inline-flex items-center justify-center h-11 rounded-2xl bg-white/[0.05] px-5 text-sm font-semibold text-text-primary transition hover:bg-white/[0.08]"
              >
                Edit settings
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <ProfileHeader
              name={profile.name}
              username={profile.username}
              email={profile.email}
              image={profile.image}
              bio={profile.bio}
              website={profile.website}
              socialLinks={profile.socialLinks}
              joinedAt={profile.createdAt}
            />

            <ProfileStats
              collections={stats.collections}
              savedAPIs={stats.savedAPIs}
              savedTools={stats.savedTools}
              recentActivity={stats.recentActivity}
            />
          </div>

          <div className="space-y-6">
            <ProfileActivityCard activity={activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
