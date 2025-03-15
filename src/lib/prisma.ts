import { PrismaClient } from '@prisma/client'

// This is a workaround for Next.js hot reloading
// See: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Create a new Prisma Client instance
const createPrismaClient = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

// Export the Prisma Client instance
export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma