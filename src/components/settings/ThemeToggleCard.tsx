"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { updateUserSettings } from "@/actions/settings";
import { useToast } from "@/providers/ToastProvider";
import type { NotificationSettings, SocialLinks, ThemePreference } from "@/lib/profile";

interface ThemeToggleCardProps {
  initialTheme: ThemePreference;
  notificationSettings: NotificationSettings;
  socialLinks: SocialLinks;
}

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
];

export function ThemeToggleCard({ initialTheme, notificationSettings, socialLinks }: ThemeToggleCardProps) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [selected, setSelected] = useState<ThemePreference>(initialTheme);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (theme && selected === "system") {
      setTheme("system");
    }
  }, [selected, setTheme, theme]);

  const handleSelect = (value: ThemePreference) => {
    setSelected(value);
    const nextTheme = value === "system" ? systemTheme ?? "dark" : value;
    setTheme(nextTheme);

    startTransition(async () => {
      const result = await updateUserSettings({
        themePreference: value,
        notificationSettings,
        socialLinks,
      });
      if (result.success) {
        toast("Theme preference updated.", "success");
      } else {
        toast(result.error || "Unable to update theme.", "error");
      }
    });
  };

  return (
    <div className="glass-card p-6 border-white/[0.06]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Theme preferences</p>
          <h3 className="text-lg font-semibold text-text-primary">Appearance</h3>
        </div>
        <div className="text-sm text-text-muted">Current: {theme === "system" ? `System (${systemTheme})` : theme}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={
                `group rounded-3xl border p-4 text-left transition-all duration-200 ${
                  active
                    ? "border-accent bg-accent/10 text-text-primary shadow-lg shadow-accent/10"
                    : "border-white/[0.08] bg-white/[0.03] text-text-secondary hover:border-white/[0.14] hover:bg-white/[0.05]"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-text-accent">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-text-muted">{option.value === "system" ? "Follow OS settings" : `Always ${option.label}`}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-text-muted">Your preference is saved to DevMarket and applied across sessions.</p>
    </div>
  );
}
