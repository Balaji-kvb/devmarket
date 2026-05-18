"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/command/CommandPalette";

// ─── Types ──────────────────────────────────────────────────────

interface LayoutShellProps {
  children: React.ReactNode;
}

// ─── Component ──────────────────────────────────────────────────

/**
 * Client-side layout shell managing:
 * - Sidebar toggle state (mobile)
 * - Command palette (self-managed via useCommandPalette hook)
 *
 * The CommandPalette is mounted once here and manages its own
 * open/close state + ⌘K shortcut internally.
 */
export function LayoutShell({ children }: LayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Sidebar handlers ──────────────────────────────────────
  const handleMenuToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuToggle={handleMenuToggle} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        {/* ── Main content area ──────────────────────────────── */}
        <main
          className="flex-1 min-w-0 transition-[margin] duration-200"
          id="main-content"
          role="main"
        >
          {children}
        </main>
      </div>

      {/* ── Global command palette (self-managed) ────────────── */}
      <CommandPalette />
    </div>
  );
}
