"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, type ElementType } from "react";
import {
  Home,
  Layers,
  Wrench,
  Terminal,
  Newspaper,
  LayoutDashboard,
  ExternalLink,
  Lock,
  X,
} from "lucide-react";
import { NAV_ITEMS, APP_CONFIG, LAYOUT } from "@/lib/constants";

// ─── Icon Lookup ────────────────────────────────────────────────

/**
 * Maps icon name strings from the nav config to actual lucide components.
 * This keeps constants.ts free of React imports while still being type-safe.
 */
const ICON_MAP: Record<string, ElementType> = {
  Home,
  Layers,
  Wrench,
  Terminal,
  Newspaper,
  LayoutDashboard,
};

// ─── Types ──────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ──────────────────────────────────────────────────

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  /**
   * Determines active state for nested routes.
   * "/" only matches exactly; all other routes match by prefix.
   */
  const isActive = useCallback(
    (href: string): boolean => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when mobile sidebar is open
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

  return (
    <>
      {/* ── Mobile overlay backdrop ──────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-surface border-r border-white/[0.06] flex flex-col transition-transform duration-200 ease-out lg:sticky lg:top-14 lg:z-30 lg:h-[calc(100vh-56px)] lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: LAYOUT.SIDEBAR_WIDTH }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* ── Mobile header ────────────────────────────────── */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/[0.06] lg:hidden">
          <span className="text-text-primary font-semibold text-sm tracking-tight">
            {APP_CONFIG.name}
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors duration-200"
            aria-label="Close navigation menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Nav items ────────────────────────────────────── */}
        <nav className="flex-1 py-3 px-3 overflow-y-auto no-scrollbar">
          <ul className="space-y-0.5" role="list">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${active ? "bg-white/[0.06] text-accent" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-accent rounded-full"
                        aria-hidden="true"
                      />
                    )}

                    {Icon && (
                      <Icon
                        size={16}
                        className={
                          active ? "text-accent" : "text-text-muted"
                        }
                        aria-hidden="true"
                      />
                    )}

                    <span className="flex-1">{item.label}</span>

                    {item.requiresAuth && (
                      <Lock
                        size={12}
                        className="text-text-muted"
                        aria-label="Requires authentication"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-mono">v{APP_CONFIG.version}</span>
            <a
              href={APP_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-text-secondary transition-colors duration-200"
              aria-label="View source on GitHub"
            >
              GitHub
              <ExternalLink size={10} aria-hidden="true" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
