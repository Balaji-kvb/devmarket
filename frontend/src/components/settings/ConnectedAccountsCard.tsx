import { Globe, Link2, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ConnectedAccountData } from "@/lib/settings";

interface ConnectedAccountsCardProps {
  accounts: ConnectedAccountData[];
}

const PROVIDER_ICONS: Record<string, LucideIcon> = {
  github: Link2,
  google: Globe,
};

export function ConnectedAccountsCard({ accounts }: ConnectedAccountsCardProps) {
  return (
    <div className="glass-card p-6 border-white/[0.06] space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Connected accounts</p>
          <h3 className="text-lg font-semibold text-text-primary">OAuth providers</h3>
        </div>
        <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
      </div>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-text-secondary">
            No external accounts connected yet. Use login providers to link GitHub or Google.
          </div>
        ) : (
          accounts.map((account) => {
            const Icon = PROVIDER_ICONS[account.provider.toLowerCase()] ?? Link2;
            return (
              <div key={account.id} className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-accent">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-text-primary">{account.provider}</p>
                    <p className="text-sm text-text-muted">Connected account ID: {account.providerAccountId}</p>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-[0.24em] text-text-muted">
                  {account.type}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-4 text-sm text-text-muted">
        Connected accounts are managed by NextAuth. If you sign in with another provider, DevMarket will keep your profile linked automatically.
      </div>
    </div>
  );
}
