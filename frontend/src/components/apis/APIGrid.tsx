import { APICard } from "@/components/cards/APICard";
import type { APIItem } from "@/lib/data";

// ─── Types ──────────────────────────────────────────────────────

interface APIGridProps {
  apis: APIItem[];
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Responsive API card grid — server component.
 * Receives pre-filtered, pre-sorted data from the page.
 */
export function APIGrid({ apis, className = "" }: APIGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
        stagger-children
        ${className}
      `}
    >
      {apis.map((api) => (
        <APICard key={api.id} api={api} />
      ))}
    </div>
  );
}
