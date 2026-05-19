import { Sparkles } from "lucide-react";
import { ToolCard } from "@/components/cards/ToolCard";
import type { ToolItem } from "@/lib/data";

// ─── Component ──────────────────────────────────────────────────

interface ToolRelatedProps {
  tools: ToolItem[];
  category: string;
}

/**
 * Related tools section — shows up to 4 same-category tools.
 * Reuses ToolCard for consistent presentation.
 */
export function ToolRelated({ tools, category }: ToolRelatedProps) {
  if (tools.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-emerald-400" aria-hidden="true" />
        <h2 className="text-base font-semibold text-text-primary">
          Related {category} Tools
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
