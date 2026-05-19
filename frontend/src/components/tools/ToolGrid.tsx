import { ToolCard } from "@/components/cards/ToolCard";
import type { ToolItem } from "@/lib/data";

// ─── Types ──────────────────────────────────────────────────────

interface ToolGridProps {
  tools: ToolItem[];
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Responsive tool card grid — server component.
 * 4 columns on desktop (denser than APIs).
 * Receives pre-filtered, pre-sorted data from the page.
 */
export function ToolGrid({ tools, className = "" }: ToolGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
        stagger-children
        ${className}
      `}
    >
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          className="w-full"
        />
      ))}
    </div>
  );
}
