"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { Menu, Search, User } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────

interface NavbarProps {
  onMenuToggle: () => void;
}

// ─── Component ──────────────────────────────────────────────────

export function Navbar({ onMenuToggle }: NavbarProps) {
  /**
   * Open the command palette by dispatching a synthetic ⌘K event.
   * The CommandPalette hook listens for this event globally.
   */
  const handleSearchClick = useCallback(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  }, []);

  return (
    <header
      className="glass-nav sticky top-0 z-50 flex items-center h-14 px-4 lg:px-6"
      role="banner"
    >
      {/* ── Mobile menu toggle ───────────────────────────────── */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors duration-200 mr-3"
        aria-label="Toggle navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* ── Wordmark ─────────────────────────────────────────── */}
      <Link
        href="/"
        className="flex items-center gap-2 mr-6 text-text-primary font-semibold text-base tracking-tight select-none shrink-0"
        aria-label={`${APP_CONFIG.name} home`}
      >
        <span className="text-accent text-lg font-bold" aria-hidden="true">
          ◆
        </span>
        <span className="hidden sm:inline">{APP_CONFIG.name}</span>
      </Link>

      {/* ── Search trigger (Raycast / Linear style) ──────────── */}
      <button
        onClick={handleSearchClick}
        className="flex items-center gap-2 flex-1 max-w-md mx-auto h-9 px-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-text-muted text-sm hover:border-white/[0.14] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group"
        aria-label="Open search (⌘K)"
      >
        <Search
          size={14}
          className="text-text-muted group-hover:text-text-secondary transition-colors"
        />
        <span className="flex-1 text-left">Search APIs, tools, and more…</span>
        <kbd
          className="hidden sm:inline-flex items-center gap-0.5 h-5 px-1.5 bg-white/[0.06] border border-white/[0.08] rounded text-[11px] font-mono text-text-muted leading-none"
          aria-hidden="true"
        >
          ⌘K
        </kbd>
      </button>

      {/* ── Right section ────────────────────────────────────── */}
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <NavbarAuth />
      </div>
    </header>
  );
}

// ─── Auth Section ───────────────────────────────────────────────

function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse" />;
  }

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-200"
        aria-label="Go to dashboard"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-accent to-violet-600 text-white text-[11px] font-bold overflow-hidden">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={14} />
          )}
        </div>
        <span className="hidden sm:inline text-sm text-text-secondary font-medium">
          {session.user.name?.split(" ")[0] || "Account"}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center h-8 px-3 text-sm font-medium text-text-secondary rounded-lg hover:text-text-primary hover:bg-white/[0.06] transition-colors duration-200"
    >
      Sign in
    </Link>
  );
}
