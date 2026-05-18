/**
 * Edge middleware for route protection.
 * Uses the edge-compatible auth config (no Prisma imports).
 * Redirects unauthenticated users from /dashboard to /login.
 */

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
