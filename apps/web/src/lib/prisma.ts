import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!;

  // For prisma+postgres:// URLs (Prisma dev server), use accelerateUrl
  if (connectionString.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      accelerateUrl: connectionString,
    });
  }

  // For standard postgres:// URLs, use the PG adapter
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
