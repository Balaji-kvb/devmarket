"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider wraps the application with next-themes.
 * - Default theme: dark (matches the design system)
 * - Attribute: class-based toggling for Tailwind compatibility
 * - disableTransitionOnChange: prevents FOUC during theme switch
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
