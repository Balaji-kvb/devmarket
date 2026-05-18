/**
 * DevMarket — Prisma Client Singleton (Prisma 7)
 *
 * Uses the pg driver adapter as required by Prisma 7.
 * Prevents multiple PrismaClient instances during hot-reload.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

function createPrismaClient(): PrismaClient {
  if (!connectionString) {
    // Return a client that will fail gracefully on queries
    // This allows the app to compile and run without a DB
    return new PrismaClient() as PrismaClient;
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  }) as unknown as PrismaClient;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
