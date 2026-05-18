import { cva, type VariantProps } from "class-variance-authority";

// ─── Variant Definitions ────────────────────────────────────────

const skeletonVariants = cva(
  /* Base: glass card container */
  [
    "rounded-xl",
    "bg-surface border border-white/[0.06]",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "p-5",
        compact: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ─── Types ──────────────────────────────────────────────────────

interface SkeletonCardProps
  extends VariantProps<typeof skeletonVariants> {
  /** Additional CSS classes. */
  className?: string;
}

// ─── Shimmer Bar ────────────────────────────────────────────────

function ShimmerBar({
  width = "100%",
  height = "h-3",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`${height} rounded-md skeleton`}
      style={{ width }}
      aria-hidden="true"
    />
  );
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Skeleton loading card matching API/Tool card dimensions.
 *
 * Two variants:
 * - `default`: Full card with header row, body lines, footer
 * - `compact`: Tighter spacing for dense list views
 *
 * Uses the `.skeleton` utility class from globals.css.
 *
 * @example
 * <SkeletonCard />
 * <SkeletonCard variant="compact" />
 */
export function SkeletonCard({ variant, className = "" }: SkeletonCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`${skeletonVariants({ variant })} ${className}`}
      role="status"
      aria-label="Loading content"
    >
      {/* Header row: icon + title block */}
      <div className="flex items-center gap-3 mb-4">
        {/* Icon placeholder */}
        <div
          className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} rounded-lg skeleton shrink-0`}
          aria-hidden="true"
        />
        {/* Title + subtitle */}
        <div className="flex-1 space-y-2">
          <ShimmerBar width="60%" height={isCompact ? "h-3" : "h-3.5"} />
          <ShimmerBar width="40%" height="h-2.5" />
        </div>
      </div>

      {/* Body: description lines */}
      <div className={`space-y-2 ${isCompact ? "mb-3" : "mb-5"}`}>
        <ShimmerBar width="100%" />
        <ShimmerBar width="85%" />
        {!isCompact && <ShimmerBar width="70%" />}
      </div>

      {/* Footer: tags */}
      <div className="flex items-center gap-2">
        <ShimmerBar width="48px" height="h-5" />
        <ShimmerBar width="56px" height="h-5" />
        <ShimmerBar width="40px" height="h-5" />
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

