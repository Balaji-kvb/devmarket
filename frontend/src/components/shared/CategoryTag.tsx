// ─── Category Color Map ─────────────────────────────────────────

/**
 * Maps API and Tool categories to muted semantic color accents.
 *
 * Design principles:
 * - No raw primary colors — all colors are desaturated / muted
 * - Consistent bg opacity (12%) + text color pairing
 * - Avoids rainbow overload — similar categories share tones
 */
const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  // API categories
  "AI & ML":          { bg: "bg-violet-500/12",  text: "text-violet-400",  border: "border-violet-500/20" },
  "Weather":          { bg: "bg-sky-500/12",     text: "text-sky-400",     border: "border-sky-500/20" },
  "Finance":          { bg: "bg-emerald-500/12", text: "text-emerald-400", border: "border-emerald-500/20" },
  "Developer Tools":  { bg: "bg-indigo-500/12",  text: "text-indigo-400",  border: "border-indigo-500/20" },
  "Entertainment":    { bg: "bg-pink-500/12",    text: "text-pink-400",    border: "border-pink-500/20" },
  "Communication":    { bg: "bg-amber-500/12",   text: "text-amber-400",   border: "border-amber-500/20" },
  "Media":            { bg: "bg-rose-500/12",    text: "text-rose-400",    border: "border-rose-500/20" },
  "Maps & Geo":       { bg: "bg-teal-500/12",    text: "text-teal-400",    border: "border-teal-500/20" },
  "Government":       { bg: "bg-slate-500/12",   text: "text-slate-400",   border: "border-slate-500/20" },
  "Social":           { bg: "bg-blue-500/12",    text: "text-blue-400",    border: "border-blue-500/20" },
  "AI":               { bg: "bg-violet-500/12",  text: "text-violet-300",  border: "border-violet-500/20" },
  "Cloud":            { bg: "bg-sky-500/12",     text: "text-sky-300",     border: "border-sky-500/20" },
  "Open Source":      { bg: "bg-emerald-500/12", text: "text-emerald-300", border: "border-emerald-500/20" },
  "APIs":             { bg: "bg-teal-500/12",    text: "text-teal-300",    border: "border-teal-500/20" },
  "Web Development":  { bg: "bg-blue-500/12",    text: "text-blue-300",    border: "border-blue-500/20" },
  "Database":         { bg: "bg-lime-500/12",    text: "text-lime-300",    border: "border-lime-500/20" },
  "Kubernetes":       { bg: "bg-cyan-500/12",    text: "text-cyan-300",    border: "border-cyan-500/20" },
  "Docker":           { bg: "bg-sky-500/12",     text: "text-sky-300",     border: "border-sky-500/20" },
  "TypeScript":       { bg: "bg-sky-500/12",     text: "text-sky-300",     border: "border-sky-500/20" },
  "Next.js":          { bg: "bg-slate-500/12",   text: "text-slate-300",   border: "border-slate-500/20" },
  "Prisma":           { bg: "bg-indigo-500/12",  text: "text-indigo-300",  border: "border-indigo-500/20" },
  "React":            { bg: "bg-cyan-500/12",    text: "text-cyan-300",    border: "border-cyan-500/20" },
  "GenAI":            { bg: "bg-violet-500/12",  text: "text-violet-300",  border: "border-violet-500/20" },
  "LLMs":             { bg: "bg-fuchsia-500/12", text: "text-fuchsia-300", border: "border-fuchsia-500/20" },
  "Productivity tools": { bg: "bg-amber-500/12", text: "text-amber-300", border: "border-amber-500/20" },
  "DevOps":           { bg: "bg-orange-500/12",  text: "text-orange-400",  border: "border-orange-500/20" },
  "Testing":          { bg: "bg-cyan-500/12",    text: "text-cyan-400",    border: "border-cyan-500/20" },
  "Design":           { bg: "bg-fuchsia-500/12", text: "text-fuchsia-400", border: "border-fuchsia-500/20" },
  "IDE":              { bg: "bg-blue-500/12",    text: "text-blue-400",    border: "border-blue-500/20" },
  "Security":         { bg: "bg-red-500/12",     text: "text-red-400",     border: "border-red-500/20" },
  "Mobile":           { bg: "bg-purple-500/12",  text: "text-purple-400",  border: "border-purple-500/20" },
};

const DEFAULT_COLORS = {
  bg: "bg-white/[0.06]",
  text: "text-text-secondary",
  border: "border-white/[0.08]",
};

// ─── Types ──────────────────────────────────────────────────────

interface CategoryTagProps {
  /** Category string from API or Tool data. */
  category: string;
  /** Additional CSS classes. */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Category tag with semantic color mapping.
 *
 * Automatically resolves the correct color accent from the
 * category string. Falls back to a neutral style for unknown categories.
 *
 * @example
 * <CategoryTag category="AI & ML" />
 * <CategoryTag category="DevOps" />
 */
export function CategoryTag({ category, className = "" }: CategoryTagProps) {
  const colors = CATEGORY_COLORS[category] || DEFAULT_COLORS;

  return (
    <span
      className={`
        inline-flex items-center
        h-5 px-2
        text-[10px] font-semibold uppercase tracking-wider
        rounded-md
        border
        ${colors.bg} ${colors.text} ${colors.border}
        ${className}
      `}
    >
      {category}
    </span>
  );
}

/** Expose color map for external use (e.g., filters, legends). */
export { CATEGORY_COLORS };
