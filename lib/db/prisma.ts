/**
 * Prisma Client Singleton
 * 
 * Handles hot reload in development by creating a global instance.
 * Prevents multiple Prisma Client instances during Next.js hot reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Force binary engine to avoid "client" engine adapter requirements on Vercel.
    engineType: "binary",
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
