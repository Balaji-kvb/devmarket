import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CategoryTag } from "@/components/shared";
import type { ToolItem } from "@/lib/data";

// ─── Platform Icons ─────────────────────────────────────────────

const PLATFORM_LABELS: Record<string, string> = {
  desktop: "Desktop",
  web: "Web",
  cli: "CLI",
  mobile: "Mobile",
};

// ─── Types ──────────────────────────────────────────────────────

interface ToolCardProps {
  tool: ToolItem;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Compact tool card for horizontal scroll sections.
 *
 * Designed to be narrower and shorter than APICard,
 * optimized for dense tool browsing.
 */
export function ToolCard({ tool, className = "" }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`
        group block
        glass-card p-4
        w-[280px] shrink-0
        transition-all duration-200
        hover:border-white/[0.12]
        hover:shadow-lg hover:shadow-black/20
        hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-2.5">
        {/* Initial avatar */}
        <div className="
          w-9 h-9 rounded-lg shrink-0
          bg-accent-2/10 border border-accent-2/20
          flex items-center justify-center
        ">
          <span className="text-accent-2 text-xs font-bold">
            {tool.name.charAt(0)}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors duration-200">
            {tool.name}
          </h3>
          <p className="text-[10px] text-text-muted truncate">
            {tool.platform
              .map((p) => PLATFORM_LABELS[p] || p)
              .join(" · ")}
          </p>
        </div>
      </div>

      {/* ── Tagline ─────────────────────────────────────────── */}
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
        {tool.tagline}
      </p>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <CategoryTag category={tool.category} />
        <span className="text-[10px] text-text-muted font-mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View
          <ExternalLink size={9} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
