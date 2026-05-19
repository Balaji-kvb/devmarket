import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getConnectedAccounts, getRecentActivity } from "@/lib/settings";
import { getUserProfile } from "@/lib/profile";
import { AccountForm } from "@/components/settings/AccountForm";
import { ConnectedAccountsCard } from "@/components/settings/ConnectedAccountsCard";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { ExportDataCard } from "@/components/settings/ExportDataCard";
import { NotificationSettingsCard } from "@/components/settings/NotificationSettingsCard";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ThemeToggleCard } from "@/components/settings/ThemeToggleCard";

export const metadata: Metadata = {
  title: "Settings — DevMarket",
  description: "Manage your account, preferences, connected apps, and privacy settings.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">Restricted</p>
        <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">Sign in to manage your settings</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary">
          Your profile preferences, theme and notification settings, connected accounts, and export controls are available once you sign in.
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
  const accounts = await getConnectedAccounts(session.user.id);
  const activity = await getRecentActivity(session.user.id);

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-400">Profile not found</p>
        <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">We could not load your profile</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary">
          Please refresh the page or sign out and sign back in if this issue persists.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          <SettingsSidebar />
        </div>

        <main className="space-y-8">
          <section className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">Settings</p>
            <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">Customize your DevMarket experience</h1>
            <p className="max-w-2xl text-sm text-text-secondary">
              Update your account profile, choose a theme, manage notifications, connect apps, and keep your data safe.
            </p>
          </section>

          <SettingsSection id="account" title="Account settings" description="Keep your profile information, display name, and website up to date.">
            <AccountForm
              name={profile.name}
              username={profile.username}
              bio={profile.bio}
              website={profile.website}
              image={profile.image}
              socialLinks={profile.socialLinks}
            />
          </SettingsSection>

          <div className="grid gap-6 xl:grid-cols-2">
            <div id="theme">
              <ThemeToggleCard
                initialTheme={profile.themePreference}
                notificationSettings={profile.notificationSettings}
                socialLinks={profile.socialLinks}
              />
            </div>
            <div id="notifications">
              <NotificationSettingsCard
                initialSettings={profile.notificationSettings}
                themePreference={profile.themePreference}
                socialLinks={profile.socialLinks}
              />
            </div>
          </div>

          <SettingsSection id="connected" title="Connected accounts" description="Link external services and manage your integrations.">
            <ConnectedAccountsCard accounts={accounts} />
          </SettingsSection>

          <div className="grid gap-6 xl:grid-cols-2">
            <div id="export">
              <ExportDataCard />
            </div>
            <div id="danger">
              <DangerZoneCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
