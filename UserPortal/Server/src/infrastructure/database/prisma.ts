import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client instance
 * We attach it to the global object in development
 * to prevent multiple connections due to hot-reloading.
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  (globalThis as any).prisma ||
  new PrismaClient({
    log: ["query", "warn", "error"], // optional logging
  });

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).prisma = prisma;
}
