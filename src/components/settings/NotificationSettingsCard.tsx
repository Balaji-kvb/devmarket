"use client";

import { useState, useTransition } from "react";
import { Bell, Sparkles, ShieldCheck, Mail } from "lucide-react";
import { updateUserSettings } from "@/actions/settings";
import { useToast } from "@/providers/ToastProvider";
import type { NotificationSettings, SocialLinks, ThemePreference } from "@/lib/profile";

interface NotificationSettingsCardProps {
  initialSettings: NotificationSettings;
  themePreference: ThemePreference;
  socialLinks: SocialLinks;
}

const OPTIONS: Array<{ key: keyof NotificationSettings; label: string; description: string; icon: typeof Bell }> = [
  { key: "productUpdates", label: "Product updates", description: "Receive release notes and platform news.", icon: Sparkles },
  { key: "newsletter", label: "Newsletter", description: "Get monthly highlights and developer tips.", icon: Mail },
  { key: "recommendations", label: "Recommendations", description: "Personalized API and tool suggestions.", icon: ShieldCheck },
  { key: "securityAlerts", label: "Security alerts", description: "Critical security updates for your account.", icon: Bell },
];

export function NotificationSettingsCard({ initialSettings, themePreference, socialLinks }: NotificationSettingsCardProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleToggle = (key: keyof NotificationSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);

    startTransition(async () => {
      const result = await updateUserSettings({
        themePreference,
        notificationSettings: next,
        socialLinks,
      });
      if (result.success) {
        toast("Notification preferences saved.", "success");
      } else {
        toast(result.error || "Unable to save notification preferences.", "error");
        setSettings(settings);
      }
    });
  };

  return (
    <div className="glass-card p-6 border-white/[0.06] space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Notifications</p>
        <h3 className="text-lg font-semibold text-text-primary">Communication settings</h3>
      </div>

      <div className="grid gap-4">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = settings[option.key];
          return (
            <button
              key={String(option.key)}
              type="button"
              onClick={() => handleToggle(option.key)}
              className={
                `group flex items-center justify-between gap-4 rounded-3xl border p-4 text-left transition-all duration-200 ${
                  active
                    ? "border-accent bg-accent/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-accent">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-text-primary">{option.label}</p>
                  <p className="text-sm text-text-muted">{option.description}</p>
                </div>
              </div>
              <div
                className={
                  `w-11 h-6 rounded-full transition-colors duration-200 ${
                    active ? "bg-accent/80" : "bg-white/[0.12]"
                  }`
                }
                aria-hidden="true"
              >
                <span
                  className={
                    `block h-5 w-5 rounded-full bg-white shadow-xl transition-transform duration-200 ${
                      active ? "translate-x-5" : "translate-x-0"
                    }`
                  }
                />
              </div>
            </button>
          );
        })}
      </div>

      {isPending && <p className="text-sm text-text-muted">Saving your preferences…</p>}
    </div>
  );
}
