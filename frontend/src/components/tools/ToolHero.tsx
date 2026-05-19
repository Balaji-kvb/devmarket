import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  GitFork,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Badge, CategoryTag } from "@/components/shared";
import type { ToolItem } from "@/lib/data";

// ─── Helpers ────────────────────────────────────────────────────

const LICENSE_VARIANT: Record<string, "success" | "warning" | "info"> = {
  "open-source": "success",
  premium: "info",
  paid: "warning",
};

// ─── Component ──────────────────────────────────────────────────

interface ToolHeroProps {
  tool: ToolItem;
}

/**
 * Hero/header section for the Tool detail page.
 * Displays name, tagline, description, badges, and quick action links.
 */
export function ToolHero({ tool }: ToolHeroProps) {
  return (
    <div className="glass-card p-6 sm:p-8">
      {/* ── Back link ───────────────────────────────────────── */}
      <Link
        href="/tools"
        className="
          inline-flex items-center gap-1.5
          text-xs text-text-muted hover:text-text-primary
          mb-5 transition-colors duration-150
        "
      >
        <ArrowLeft size={13} aria-hidden="true" />
        Back to Tools
      </Link>

      {/* ── Header row ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 min-w-0">
          {/* Avatar */}
          <div className="
            w-14 h-14 rounded-xl shrink-0
            bg-emerald-500/10 border border-emerald-500/20
            flex items-center justify-center
          ">
            <span className="text-emerald-400 text-xl font-bold">
              {tool.name.charAt(0)}
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {tool.name}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              {tool.tagline}
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
            aria-label="Save tool"
          >
            <Bookmark size={16} />
          </div>

          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1.5
                h-9 px-3.5
                text-xs font-medium
                bg-white/[0.06] border border-white/[0.08]
                text-text-primary rounded-lg
                hover:bg-white/[0.1]
                transition-colors duration-150
              "
            >
              <GitFork size={14} aria-hidden="true" />
              GitHub
            </a>
          )}

          {tool.docsUrl && (
            <a
              href={tool.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1.5
                h-9 px-3.5
                text-xs font-medium
                bg-emerald-500 text-background
                rounded-lg
                hover:bg-emerald-500/90
                transition-colors duration-150
              "
            >
              <BookOpen size={13} aria-hidden="true" />
              Docs
            </a>
          )}
        </div>
      </div>

      {/* ── Description ─────────────────────────────────────── */}
      <p className="text-sm text-text-secondary leading-relaxed mt-5 max-w-2xl">
        {tool.description}
      </p>

      {/* ── Badges ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-5 border-t border-white/[0.06]">
        <CategoryTag category={tool.category} />
        <Badge variant={LICENSE_VARIANT[tool.license] || "default"}>
          {tool.license}
        </Badge>
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent font-mono transition-colors duration-150"
        >
          <ExternalLink size={11} className="text-emerald-400/60" aria-hidden="true" />
          {tool.websiteUrl.replace(/^https?:\/\//, "")}
        </a>
      </div>
    </div>
  );
}
