import Link from "next/link";
import { Cog, Palette, Bell, ShieldCheck, Download, Trash2 } from "lucide-react";

const SIDEBAR_ITEMS = [
  { id: "account", label: "Account", icon: Cog, href: "#account" },
  { id: "theme", label: "Theme", icon: Palette, href: "#theme" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "#notifications" },
  { id: "connected", label: "Connected Accounts", icon: ShieldCheck, href: "#connected" },
  { id: "export", label: "Export Data", icon: Download, href: "#export" },
  { id: "danger", label: "Danger Zone", icon: Trash2, href: "#danger" },
];

export function SettingsSidebar() {
  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="glass-card p-6 border-white/[0.06] space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted mb-2">
            Settings
          </p>
          <h2 className="text-xl font-semibold text-text-primary">
            Manage your account
          </h2>
        </div>

        <nav aria-label="Settings sections" className="space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-white/[0.04] hover:text-text-primary"
              >
                <Icon size={16} className="text-accent" aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-white/[0.02] p-4 border border-white/[0.06]">
          <p className="text-sm font-medium text-text-primary mb-2">Quick tips</p>
          <p className="text-sm text-text-muted leading-6">
            Keep your profile up to date and use connected accounts to streamline login.
          </p>
        </div>
      </div>
    </aside>
  );
}
