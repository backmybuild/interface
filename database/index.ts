import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Avoid creating extra clients in dev (hot-reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
