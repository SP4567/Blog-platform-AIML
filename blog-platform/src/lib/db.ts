import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) return undefined;

  if (envUrl.startsWith("file:")) {
    const rawPath = envUrl.slice(5);
    if (!path.isAbsolute(rawPath)) {
      const candidates = [
        path.resolve(process.cwd(), "prisma", "dev.db"),
        path.resolve(process.cwd(), "dev.db"),
        path.resolve(process.cwd(), rawPath.replace(/^\.\//, "")),
        path.resolve(process.cwd(), "prisma", rawPath.replace(/^\.\//, "")),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          return `file:${candidate.replace(/\\/g, "/")}`;
        }
      }
    }
  }

  return envUrl;
}

function createPrismaClient() {
  const url = getDatabaseUrl();

  if (!url) {
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("DATABASE_URL is not configured.");
      },
    });
  }

  return (
    globalForPrisma.prisma ??
    new PrismaClient({
      datasources: {
        db: {
          url,
        },
      },
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  );
}

export const prisma = createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma as PrismaClient;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function pingDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  await prisma.$queryRaw`SELECT 1`;
}
