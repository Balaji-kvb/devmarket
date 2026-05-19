import { Layers, Bookmark, Clock, FolderOpen } from "lucide-react";

interface ProfileStatsProps {
  collections: number;
  savedAPIs: number;
  savedTools: number;
  recentActivity: number;
}

const STATS = [
  { key: "collections", label: "Collections", icon: FolderOpen, color: "text-accent" },
  { key: "savedAPIs", label: "Saved APIs", icon: Layers, color: "text-emerald-400" },
  { key: "savedTools", label: "Saved Tools", icon: Bookmark, color: "text-violet-400" },
  { key: "recentActivity", label: "Recent Activity", icon: Clock, color: "text-sky-400" },
];

export function ProfileStats({ collections, savedAPIs, savedTools, recentActivity }: ProfileStatsProps) {
  const values = { collections, savedAPIs, savedTools, recentActivity };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="glass-card p-5 border-white/[0.06] group hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/[0.05] ${item.color}`}>
                <Icon size={16} aria-hidden="true" />
              </span>
              <p className="text-sm text-text-muted uppercase tracking-[0.24em]">{item.label}</p>
            </div>
            <p className="text-3xl font-semibold text-text-primary">{values[item.key as keyof typeof values]}</p>
          </div>
        );
      })}
    </div>
  );
}
