/**
 * DevMarket — Auth.js (NextAuth v5) Full Configuration
 *
 * Node.js-only auth config with Prisma adapter.
 * Edge middleware imports from auth.config.ts instead.
 *
 * Supports:
 * - GitHub OAuth → auto-creates User + Account in DB
 * - Google OAuth → auto-creates User + Account in DB
 * - Demo credentials → upserts User in jwt callback
 *
 * Session strategy: JWT (edge-compatible token verification).
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, account }) {
      // Runs during sign-in (user is only present then)
      if (user?.email) {
        // For credentials provider, the adapter does NOT auto-create users.
        // We manually upsert so the user exists in the DB.
        if (!account || account.provider === "credentials") {
          try {
            const dbUser = await prisma.user.upsert({
              where: { email: user.email },
              update: { name: user.name ?? undefined },
              create: {
                email: user.email,
                name: user.name,
                image: user.image,
              },
            });
            token.sub = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
          } catch {
            // DB not available — use temporary id
            token.sub = user.id;
          }
        } else {
          // OAuth users — adapter creates User + Account automatically
          token.sub = user.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
