import {
  ExternalLink,
  GitFork,
  BookOpen,
  Hash,
  Info,
  Scale,
} from "lucide-react";
import type { ToolItem } from "@/lib/data";

// ─── Component ──────────────────────────────────────────────────

interface ToolMetadataProps {
  tool: ToolItem;
}

/**
 * Sticky sidebar metadata panel — shows quick info,
 * links (website, GitHub, docs), and tags.
 */
export function ToolMetadata({ tool }: ToolMetadataProps) {
  return (
    <div className="glass-card p-5 space-y-5">
      {/* ── Quick Info ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Info size={13} className="text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Quick Info
          </h3>
        </div>

        <dl className="space-y-2.5">
          <div>
            <dt className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Category
            </dt>
            <dd className="text-sm text-text-primary font-medium">
              {tool.category}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Platforms
            </dt>
            <dd className="text-sm text-text-secondary capitalize">
              {tool.platform.join(", ")}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Scale size={11} className="text-text-muted" aria-hidden="true" />
            <span className="text-xs text-text-muted capitalize">{tool.license}</span>
          </div>
        </dl>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06]" />

      {/* ── Links ───────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
          Links
        </h3>
        <div className="space-y-2">
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              text-xs text-emerald-400 hover:text-emerald-300
              transition-colors duration-150
            "
          >
            <ExternalLink size={12} aria-hidden="true" />
            Website
          </a>

          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2
                text-xs text-text-secondary hover:text-text-primary
                transition-colors duration-150
              "
            >
              <GitFork size={12} aria-hidden="true" />
              Source Code
            </a>
          )}

          {tool.docsUrl && (
            <a
              href={tool.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2
                text-xs text-text-secondary hover:text-text-primary
                transition-colors duration-150
              "
            >
              <BookOpen size={12} aria-hidden="true" />
              Documentation
            </a>
          )}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06]" />

      {/* ── Tags ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Hash size={13} className="text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Tags
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="
                inline-block
                px-2 py-0.5
                text-[10px] text-text-muted
                bg-white/[0.04] border border-white/[0.06]
                rounded-md font-mono
              "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
