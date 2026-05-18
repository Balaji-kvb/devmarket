import type { ElementType, ReactNode } from "react";

// ─── Types ──────────────────────────────────────────────────────

interface EmptyStateProps {
  /** Lucide icon component to render. */
  icon: ElementType;
  /** Primary heading — should describe what's missing. */
  title: string;
  /** Supportive message — suggest what the user can do. */
  description: string;
  /** Optional action button. */
  action?: ReactNode;
  /** Additional CSS classes on the container. */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Empty state component for zero-data views.
 *
 * Renders a centered layout with icon, title, description,
 * and optional action button. Uses the existing design tokens
 * for consistent spacing and typography.
 *
 * @example
 * <EmptyState
 *   icon={Search}
 *   title="No APIs match your filters"
 *   description="Try adjusting your search terms or clearing filters"
 *   action={<button onClick={clear}>Clear filters</button>}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        py-16 px-6
        ${className}
      `}
      role="status"
      aria-label={title}
    >
      {/* Icon container */}
      <div
        className="
          flex items-center justify-center
          w-12 h-12 mb-4
          rounded-xl
          bg-white/[0.04] border border-white/[0.06]
        "
        aria-hidden="true"
      >
        <Icon size={20} className="text-text-muted" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-muted max-w-[280px] leading-relaxed mb-4">
        {description}
      </p>

      {/* Optional action */}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
