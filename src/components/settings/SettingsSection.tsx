import type { ReactNode } from "react";

interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ id, title, description, children }: SettingsSectionProps) {
  return (
    <section id={id} className="glass-card p-6 border-white/[0.06] space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-text-muted max-w-2xl">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
