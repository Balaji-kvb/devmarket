import {
  Calendar,
  ExternalLink,
  Hash,
  Info,
} from "lucide-react";
import type { APIItem } from "@/lib/data";

// ─── Component ──────────────────────────────────────────────────

interface APIMetadataProps {
  api: APIItem;
}

/**
 * Sticky sidebar metadata panel — shows tags, links,
 * provider info, and dates.
 */
export function APIMetadata({ api }: APIMetadataProps) {
  const createdDate = new Date(api.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="glass-card p-5 space-y-5">
      {/* ── Quick Info ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Info size={13} className="text-accent" aria-hidden="true" />
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Quick Info
          </h3>
        </div>

        <dl className="space-y-2.5">
          <div>
            <dt className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Provider
            </dt>
            <dd className="text-sm text-text-primary font-medium">
              {api.provider}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Authentication
            </dt>
            <dd className="text-sm text-text-secondary font-mono">
              {api.authMethod}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Pricing
            </dt>
            <dd className="text-sm text-text-secondary capitalize">
              {api.pricing}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={11} className="text-text-muted" aria-hidden="true" />
            <span className="text-xs text-text-muted">Added {createdDate}</span>
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
            href={api.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              text-xs text-accent hover:text-accent/80
              transition-colors duration-150
            "
          >
            <ExternalLink size={12} aria-hidden="true" />
            Documentation
          </a>
          <a
            href={api.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              text-xs text-text-secondary hover:text-text-primary
              font-mono transition-colors duration-150
            "
          >
            <ExternalLink size={12} aria-hidden="true" />
            Base URL
          </a>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06]" />

      {/* ── Tags ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Hash size={13} className="text-accent" aria-hidden="true" />
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Tags
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {api.tags.map((tag) => (
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
