import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Globe,
  Shield,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Badge, CategoryTag } from "@/components/shared";
import type { APIItem } from "@/lib/data";

// ─── Helpers ────────────────────────────────────────────────────

const AUTH_LABELS: Record<string, string> = {
  "api-key": "API Key",
  oauth: "OAuth 2.0",
  none: "No Auth",
  bearer: "Bearer Token",
};

const PRICING_VARIANT: Record<string, "success" | "warning" | "info"> = {
  free: "success",
  premium: "info",
  paid: "warning",
};

// ─── Component ──────────────────────────────────────────────────

interface APIHeroProps {
  api: APIItem;
}

/**
 * Hero/header section for the API detail page.
 * Displays name, provider, description, badges, and quick actions.
 */
export function APIHero({ api }: APIHeroProps) {
  return (
    <div className="glass-card p-6 sm:p-8">
      {/* ── Back link ───────────────────────────────────────── */}
      <Link
        href="/apis"
        className="
          inline-flex items-center gap-1.5
          text-xs text-text-muted hover:text-text-primary
          mb-5 transition-colors duration-150
        "
      >
        <ArrowLeft size={13} aria-hidden="true" />
        Back to APIs
      </Link>

      {/* ── Header row ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {/* Avatar */}
          <div className="
            w-14 h-14 rounded-xl shrink-0
            bg-accent/10 border border-accent/20
            flex items-center justify-center
          ">
            <span className="text-accent text-xl font-bold">
              {api.name.charAt(0)}
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {api.name}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              by <span className="text-text-secondary font-medium">{api.provider}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="
              flex items-center justify-center
              w-9 h-9 rounded-lg
              bg-white/[0.04] border border-white/[0.06]
              text-text-muted hover:text-text-primary
              transition-colors duration-150 cursor-pointer
            "
            aria-label="Save API"
          >
            <Bookmark size={16} />
          </div>
          <a
            href={api.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1.5
              h-9 px-3.5
              text-xs font-medium
              bg-accent text-background
              rounded-lg
              hover:bg-accent/90
              transition-colors duration-150
            "
          >
            <ExternalLink size={13} aria-hidden="true" />
            View Docs
          </a>
        </div>
      </div>

      {/* ── Description ─────────────────────────────────────── */}
      <p className="text-sm text-text-secondary leading-relaxed mt-5 max-w-2xl">
        {api.description}
      </p>

      {/* ── Badges ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-5 border-t border-white/[0.06]">
        <CategoryTag category={api.category} />
        <Badge variant={PRICING_VARIANT[api.pricing] || "default"}>
          {api.pricing}
        </Badge>
        <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
          <Shield size={11} className="text-accent/60" aria-hidden="true" />
          {AUTH_LABELS[api.authMethod] || api.authMethod}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
          <Globe size={11} className="text-accent/60" aria-hidden="true" />
          {api.baseUrl}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <Tag size={11} className="text-accent/60" aria-hidden="true" />
          {api.savedCount.toLocaleString()} saves
        </span>
      </div>
    </div>
  );
}
