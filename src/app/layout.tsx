import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { UserStoreProvider } from "@/providers/UserStoreProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import "@/styles/globals.css";

/* ─── Font Setup ─────────────────────────────────────────────
   Geist Sans: UI text, headings, labels
   Geist Mono: code, endpoints, timestamps, metrics
   Both loaded via next/font for zero-CLS optimization
   ──────────────────────────────────────────────────────────── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ─── Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "DevMarket — Developer Ecosystem Platform",
    template: "%s | DevMarket",
  },
  description:
    "Discover APIs, explore developer tools, test endpoints, format code, and stay updated with curated tech news — all in one platform.",
  keywords: [
    "API marketplace",
    "developer tools",
    "API playground",
    "code formatter",
    "JSON validator",
    "tech news",
    "DevOps",
  ],
  authors: [{ name: "DevMarket" }],
  creator: "DevMarket",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevMarket",
    title: "DevMarket — Developer Ecosystem Platform",
    description:
      "Discover APIs, explore developer tools, test endpoints, and stay updated with tech news.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMarket — Developer Ecosystem Platform",
    description:
      "Discover APIs, explore developer tools, test endpoints, and stay updated with tech news.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <SessionProvider>
          <UserStoreProvider>
            <ToastProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </ToastProvider>
          </UserStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
