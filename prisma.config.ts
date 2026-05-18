/**
 * DevMarket — Prisma Configuration (v7)
 *
 * Prisma 7 requires datasource URL to be defined here
 * rather than in schema.prisma.
 */

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
