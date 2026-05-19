"use client";

import { useEffect, useRef } from "react";
import { CommandInput } from "@/components/command/CommandInput";
import { CommandResults } from "@/components/command/CommandResults";
import { useCommandPalette } from "@/hooks/useCommandPalette";

// ─── Keyboard Footer Hint ───────────────────────────────────────

function FooterHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="
            inline-flex items-center justify-center
            min-w-[20px] h-5 px-1
            bg-white/[0.06] border border-white/[0.08]
            rounded text-[10px] font-mono text-text-muted
            leading-none
          "
        >
          {key}
        </kbd>
      ))}
      <span className="text-[11px] text-text-muted">{label}</span>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Global command palette — the main export.
 *
 * Renders a spotlight-style centered modal with:
 * - Fuzzy search input
 * - Grouped results (APIs, Tools, Navigation)
 * - Keyboard navigation (↑/↓ navigate, Enter selects, Esc closes)
 * - Recent searches (localStorage)
 * - Focus trap within the dialog
 * - Backdrop blur
 */
export function CommandPalette() {
  const {
    isOpen,
    setOpen,
    query,
    setQuery,
    debouncedQuery,
    grouped,
    hasResults,
    recentSearches,
    select,
    replayRecent,
    clearRecent,
  } = useCommandPalette();

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Focus restoration ─────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // ── ESC to close ──────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, setOpen]);

  // ── Prevent body scroll when open ─────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        className="
          fixed inset-0 z-[60]
          bg-black/60 backdrop-blur-sm
          animate-fade-in
        "
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Dialog ───────────────────────────────────────────── */}
      <div
        className="
          fixed inset-0 z-[61]
          flex items-start justify-center
          pt-[min(20vh,160px)] px-4
        "
      >
        <div
          ref={dialogRef}
          className="
            w-full max-w-[560px]
            bg-[#0f1117]/95 border border-white/[0.1]
            backdrop-blur-2xl
            rounded-xl
            shadow-2xl shadow-black/40
            overflow-hidden
            animate-fade-in-up
          "
          role="dialog"
          aria-modal="true"
          aria-label="Search DevMarket — press escape to close"
        >
          {/* ── Input ────────────────────────────────────────── */}
          <CommandInput value={query} onChange={setQuery} />

          {/* ── Results ──────────────────────────────────────── */}
          <CommandResults
            grouped={grouped}
            hasResults={hasResults}
            debouncedQuery={debouncedQuery}
            query={query}
            recentSearches={recentSearches}
            onSelect={select}
            onReplayRecent={replayRecent}
            onClearRecent={clearRecent}
          />

          {/* ── Footer ───────────────────────────────────────── */}
          <div className="flex items-center gap-4 px-4 h-9 border-t border-white/[0.08]">
            <FooterHint keys={["↑", "↓"]} label="Navigate" />
            <FooterHint keys={["↵"]} label="Select" />
            <FooterHint keys={["Esc"]} label="Close" />
          </div>
        </div>
      </div>
    </>
  );
}
