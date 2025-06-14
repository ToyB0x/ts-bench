import { PrismaClient } from "../generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

// biome-ignore lint/complexity/useLiteralKeys: strictest/tsconfig.json
if (process.env?.["NODE_ENV"] !== "production") globalForPrisma.prisma = prisma;

export * from "../generated/client";
