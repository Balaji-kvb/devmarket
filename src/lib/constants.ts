/* ================================================================
   DevMarket — Constants & Configuration
   Data-driven navigation, layout dimensions, and app metadata.
   ================================================================ */

import type { NavItem } from "@/types";

// ─── Layout Dimensions (8px grid) ───────────────────────────────

export const LAYOUT = {
  /** Navbar height in pixels. */
  NAV_HEIGHT: 56,
  /** Sidebar width in pixels (desktop). */
  SIDEBAR_WIDTH: 240,
  /** Breakpoint at which sidebar collapses (px). */
  SIDEBAR_BREAKPOINT: 1024,
  /** Maximum content width (px). */
  MAX_CONTENT_WIDTH: 1280,
} as const;

// ─── Navigation Items ───────────────────────────────────────────

/**
 * Primary sidebar navigation items.
 * `icon` is a lucide-react icon name (PascalCase).
 * Items are rendered in this order.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "Home",
  },
  {
    label: "APIs",
    href: "/apis",
    icon: "Layers",
  },
  {
    label: "Tools",
    href: "/tools",
    icon: "Wrench",
  },
  {
    label: "Playground",
    href: "/playground",
    icon: "Terminal",
  },
  {
    label: "News",
    href: "/news",
    icon: "Newspaper",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    requiresAuth: true,
  },
];

// ─── App Metadata ───────────────────────────────────────────────

export const APP_CONFIG = {
  name: "DevMarket",
  version: "1.0.0",
  description: "Developer Ecosystem Platform",
  github: "https://github.com/devmarket/devmarket",
} as const;

// ─── Keyboard Shortcuts ─────────────────────────────────────────

export const SHORTCUTS = {
  SEARCH: { key: "k", modifier: "meta" },
} as const;
