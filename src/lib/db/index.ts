import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createClient(): PrismaClient {
  // Avoid hard crash when DATABASE_URL is missing (e.g. first Vercel deploy).
  // Queries will still fail and should be wrapped in try/catch by callers.
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.length > 10);
}
