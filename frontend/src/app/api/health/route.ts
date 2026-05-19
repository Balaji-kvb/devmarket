import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const started = Date.now();
  let dbStatus = "unknown";

  try {
    // lightweight query to check DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "ok";
  } catch (err) {
    dbStatus = "error";
  }

  const uptime = process.uptime();
  const payload = {
    status: "ok",
    uptime: Math.round(uptime),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    database: dbStatus,
    version: process.env.APP_VERSION || "0.0.0",
    pingMs: Date.now() - started,
  };

  return NextResponse.json(payload, { status: 200 });
}
