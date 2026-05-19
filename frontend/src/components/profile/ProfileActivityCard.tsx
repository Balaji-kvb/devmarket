import { Activity, Clock, Layers } from "lucide-react";

interface RecentItem {
  id: string;
  name: string;
  type: string;
  category: string;
  viewedAt: string;
}

interface ProfileActivityCardProps {
  activity: RecentItem[];
}

export function ProfileActivityCard({ activity }: ProfileActivityCardProps) {
  return (
    <div className="glass-card p-6 border-white/[0.06]">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Recent activity</p>
          <h2 className="text-lg font-semibold text-text-primary">Developer interactions</h2>
        </div>
        <Activity size={20} className="text-accent" aria-hidden="true" />
      </div>

      {activity.length === 0 ? (
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-6 text-sm text-text-secondary">
          No recent activity yet. Your feed will populate as you explore APIs and tools.
        </div>
      ) : (
        <div className="space-y-4">
          {activity.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Layers size={14} className="text-accent" aria-hidden="true" />
                  <span>{item.type}</span>
                  <span className="text-text-muted">•</span>
                  <span>{item.category}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-text-muted">
                  <Clock size={12} />
                  {new Date(item.viewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
              <p className="text-sm font-medium text-text-primary">{item.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
