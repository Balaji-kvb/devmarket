interface PlaygroundTabsProps {
  active: "response" | "history";
  onChange: (value: "response" | "history") => void;
}

const TABS: Array<{ value: "response" | "history"; label: string }> = [
  { value: "response", label: "Response" },
  { value: "history", label: "History" },
];

export function PlaygroundTabs({ active, onChange }: PlaygroundTabsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3 border-b border-white/[0.08] pb-3">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === tab.value
              ? "bg-white/[0.08] text-text-primary shadow-sm shadow-black/10"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
