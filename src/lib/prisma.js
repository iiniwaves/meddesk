import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"], // optional but helps debugging
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}