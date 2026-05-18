import Link from "next/link";
import { ExternalLink, Bookmark } from "lucide-react";
import { Badge, CategoryTag } from "@/components/shared";
import type { APIItem } from "@/lib/data";

// ─── Auth Label Map ─────────────────────────────────────────────

const AUTH_LABELS: Record<string, string> = {
  "api-key": "API Key",
  oauth: "OAuth 2.0",
  none: "No Auth",
  bearer: "Bearer Token",
};

const PRICING_VARIANT: Record<string, "success" | "warning" | "info"> = {
  free: "success",
  freemium: "info",
  paid: "warning",
};

// ─── Types ──────────────────────────────────────────────────────

interface APICardProps {
  api: APIItem;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * API marketplace card — displays provider, category, pricing,
 * auth method, and description.
 *
 * Server-component safe (no interactivity).
 * The save button is a placeholder for future client-side enhancement.
 */
export function APICard({ api, className = "" }: APICardProps) {
  return (
    <Link
      href={`/apis/${api.slug}`}
      className={`
        group block
        glass-card p-5
        transition-all duration-200
        hover:border-white/[0.12]
        hover:shadow-lg hover:shadow-black/20
        hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Initial avatar */}
          <div className="
            w-10 h-10 rounded-lg shrink-0
            bg-accent/10 border border-accent/20
            flex items-center justify-center
          ">
            <span className="text-accent text-sm font-bold">
              {api.name.charAt(0)}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors duration-200">
              {api.name}
            </h3>
            <p className="text-xs text-text-muted truncate">
              {api.provider}
            </p>
          </div>
        </div>

        {/* Save button placeholder — becomes client interactive in Phase 8+ */}
        <div
          className="
            flex items-center justify-center
            w-7 h-7 rounded-md shrink-0
            text-text-muted
          "
          aria-hidden="true"
        >
          <Bookmark size={14} />
        </div>
      </div>

      {/* ── Description ─────────────────────────────────────── */}
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
        {api.tagline}
      </p>

      {/* ── Metadata row ────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <CategoryTag category={api.category} />
        <Badge variant={PRICING_VARIANT[api.pricing] || "default"}>
          {api.pricing}
        </Badge>
        <span className="text-[10px] text-text-muted font-mono flex items-center gap-1">
          <ExternalLink size={9} aria-hidden="true" />
          {AUTH_LABELS[api.authMethod] || api.authMethod}
        </span>
      </div>
    </Link>
  );
}
