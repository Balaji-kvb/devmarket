import { Monitor, Globe, Terminal } from "lucide-react";
import type { ToolItem } from "@/lib/data";

// ─── Platform Config ────────────────────────────────────────────

const PLATFORM_CONFIG: Record<string, { icon: typeof Monitor; label: string; description: string }> = {
  desktop: {
    icon: Monitor,
    label: "Desktop",
    description: "Native application with GUI for macOS, Windows, and Linux",
  },
  web: {
    icon: Globe,
    label: "Web",
    description: "Browser-based interface accessible from any device",
  },
  cli: {
    icon: Terminal,
    label: "CLI",
    description: "Command-line interface for terminal and scripting workflows",
  },
};

// ─── Component ──────────────────────────────────────────────────

interface ToolPlatformsProps {
  platforms: ToolItem["platform"];
}

/**
 * Platform support cards showing which environments
 * the tool runs on (Desktop, Web, CLI).
 */
export function ToolPlatforms({ platforms }: ToolPlatformsProps) {
  if (platforms.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-base font-semibold text-text-primary mb-4">
        Platform Support
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          if (!config) return null;

          const Icon = config.icon;

          return (
            <div
              key={platform}
              className="
                p-4 rounded-lg
                bg-emerald-500/[0.04] border border-emerald-500/10
                flex flex-col items-center text-center gap-2
              "
            >
              <div className="
                w-10 h-10 rounded-lg
                bg-emerald-500/10
                flex items-center justify-center
              ">
                <Icon size={18} className="text-emerald-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-text-primary">
                {config.label}
              </p>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {config.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
