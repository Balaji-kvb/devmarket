import Link from "next/link";

interface NewsEmptyStateProps {
  query: string;
  category: string;
  onClearFilters: () => void;
}

export function NewsEmptyState({ query, category, onClearFilters }: NewsEmptyStateProps) {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-text-muted mb-4">No articles found</p>
      <h2 className="text-xl font-semibold text-text-primary mb-3">
        Nothing matched your search.
      </h2>
      <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
        Try a different keyword or reset filters to discover trending developer news, tutorials, and analysis.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent text-white text-sm font-semibold transition-colors hover:bg-accent/90"
        >
          Reset filters
        </button>
        <Link
          href="/news"
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Browse news home
        </Link>
      </div>
    </div>
  );
}
