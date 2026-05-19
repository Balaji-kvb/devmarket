import { LayoutShell } from "@/components/layout/LayoutShell";

/**
 * Shared layout for all (main) routes.
 * Server component — delegates client interactivity to LayoutShell.
 * Wraps all pages with Navbar + Sidebar chrome.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutShell>{children}</LayoutShell>;
}
