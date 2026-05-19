import { cva, type VariantProps } from "class-variance-authority";

// ─── Variant Definitions ────────────────────────────────────────

const badgeVariants = cva(
  /* Base styles */
  [
    "inline-flex items-center justify-center",
    "font-medium leading-none",
    "whitespace-nowrap select-none",
    "rounded-md",
    "transition-colors duration-150",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.06] text-text-secondary border border-white/[0.08]",
        success:
          "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20",
        warning:
          "bg-amber-500/12 text-amber-400 border border-amber-500/20",
        danger:
          "bg-red-500/12 text-red-400 border border-red-500/20",
        info:
          "bg-sky-500/12 text-sky-400 border border-sky-500/20",
        accent:
          "bg-[var(--accent)]/12 text-accent border border-[var(--accent)]/20",
      },
      size: {
        sm: "h-5 px-1.5 text-[10px] tracking-wide",
        md: "h-6 px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

// ─── Types ──────────────────────────────────────────────────────

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Multi-variant badge component.
 *
 * Supports 6 semantic variants and 2 sizes.
 * Uses CVA for composable, type-safe variant classes.
 * Extends standard span props for full className composability.
 *
 * @example
 * <Badge variant="success" size="md">Active</Badge>
 * <Badge variant="danger">Deprecated</Badge>
 */
export function Badge({
  variant,
  size,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`${badgeVariants({ variant, size })} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
