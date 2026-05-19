import { Search } from "lucide-react";

interface NewsSearchBarProps {
  query: string;
  onQueryChange: (next: string) => void;
  className?: string;
}

export function NewsSearchBar({ query, onQueryChange, className = "" }: NewsSearchBarProps) {
  return (
    <div className={`glass-card p-4 flex items-center gap-3 ${className}`}>
      <Search size={18} className="text-text-muted shrink-0" aria-hidden="true" />
      <label className="sr-only" htmlFor="news-search">
        Search news
      </label>
      <input
        id="news-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search developer news, topics, and tags…"
        className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted"
      />
    </div>
  );
}
