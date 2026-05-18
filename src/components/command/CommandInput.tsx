"use client";

import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

// ─── Component ──────────────────────────────────────────────────

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Focused search input for the command palette.
 * Auto-focuses on mount; clear button when non-empty.
 */
export function CommandInput({ value, onChange }: CommandInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when mounted
  useEffect(() => {
    // Small delay ensures the dialog animation doesn't steal focus
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.08]">
      <Search size={16} className="text-text-muted shrink-0" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search APIs, tools, and more…"
        className="
          flex-1
          bg-transparent border-none outline-none
          text-sm text-text-primary
          placeholder:text-text-muted
          font-normal
        "
        role="combobox"
        aria-expanded="true"
        aria-autocomplete="list"
        aria-controls="command-results"
        aria-label="Search DevMarket"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="
            flex items-center justify-center
            w-5 h-5 rounded
            text-text-muted hover:text-text-secondary
            transition-colors duration-150
          "
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
