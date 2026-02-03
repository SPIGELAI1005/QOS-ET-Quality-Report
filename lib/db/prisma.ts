/**
 * Prisma Client Singleton
 * 
 * Handles hot reload in development by creating a global instance.
 * Prevents multiple Prisma Client instances during Next.js hot reloads.
 */

import { PrismaClient } from "@prisma/client";

// Force Prisma to use the binary engine to avoid the client adapter requirement on Vercel.
process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new (PrismaClient as any)({
    engineType: "binary",
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
