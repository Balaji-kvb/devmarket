"use client";

/**
 * Tool-specific empty state with filter reset action.
 */

import { Search, FilterX } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { useToolFilters } from "@/hooks/useToolFilters";

interface ToolEmptyStateProps {
  hasFilters: boolean;
  hasSearch: boolean;
}

export function ToolEmptyState({ hasFilters, hasSearch }: ToolEmptyStateProps) {
  const { clearAll } = useToolFilters();

  const title = hasSearch
    ? "No tools match your search"
    : hasFilters
      ? "No tools match your filters"
      : "No tools available";

  const description = hasSearch
    ? "Try different keywords or broaden your search terms"
    : hasFilters
      ? "Adjust your category, platform, or license filters to see more results"
      : "Tools will appear here once they are added to the platform";

  return (
    <EmptyState
      icon={hasSearch ? Search : FilterX}
      title={title}
      description={description}
      action={
        (hasFilters || hasSearch) ? (
          <button
            onClick={clearAll}
            className="
              inline-flex items-center gap-1.5
              h-8 px-3
              text-xs text-accent font-medium
              bg-accent/10 border border-accent/20
              rounded-lg
              hover:bg-accent/15
              transition-colors duration-150
            "
          >
            <FilterX size={13} aria-hidden="true" />
            Clear all filters
          </button>
        ) : undefined
      }
    />
  );
}
