/**
 * DevMarket — Auth.js Edge-Compatible Configuration
 *
 * This file contains ONLY the config that can run in Edge Runtime
 * (middleware). No database imports, no Prisma, no Node.js APIs.
 *
 * The full auth config (with Prisma adapter) lives in auth.ts.
 */

import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Demo credentials for local development (no OAuth secrets needed)
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@devmarket.dev" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        if (!email) return null;
        return {
          id: email, // Temporary — jwt callback replaces with DB id
          name: email.split("@")[0] || "Demo User",
          email,
          image: null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", request.nextUrl));
      }
      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
