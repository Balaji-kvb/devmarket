import { Sparkles } from "lucide-react";
import { APICard } from "@/components/cards/APICard";
import type { APIItem } from "@/lib/data";

// ─── Component ──────────────────────────────────────────────────

interface APIRelatedProps {
  apis: APIItem[];
  category: string;
}

/**
 * Related APIs section — shows up to 3 same-category APIs.
 * Reuses APICard for consistent presentation.
 */
export function APIRelated({ apis, category }: APIRelatedProps) {
  if (apis.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-accent" aria-hidden="true" />
        <h2 className="text-base font-semibold text-text-primary">
          Related {category} APIs
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map((api) => (
          <APICard key={api.id} api={api} />
        ))}
      </div>
    </div>
  );
}
