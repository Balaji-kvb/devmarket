interface NewsCategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function NewsCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: NewsCategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        type="button"
        onClick={() => onCategoryChange("All")}
        className={
          `inline-flex items-center h-8 px-3 text-xs font-semibold rounded-full transition-all duration-150 whitespace-nowrap ${
            activeCategory === "All"
              ? "bg-accent/15 text-accent border border-accent/25"
              : "bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:bg-white/[0.08] hover:text-text-primary"
          }`
        }
        aria-pressed={activeCategory === "All"}
      >
        All topics
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={
            `inline-flex items-center h-8 px-3 text-xs font-semibold rounded-full transition-all duration-150 whitespace-nowrap ${
              activeCategory === category
                ? "bg-accent/15 text-accent border border-accent/25"
                : "bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:bg-white/[0.08] hover:text-text-primary"
            }`
          }
          aria-pressed={activeCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
