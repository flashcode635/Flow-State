import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/postgres'
const adapter = new PrismaPg({ connectionString })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.DATABASE_URL) {
  prisma.$connect()
    .then(() => console.log('✅ Connected to database'))
    .catch((e: unknown) => console.error('❌ Failed to connect to database:', e))
} else {
  console.warn('⚠️ DATABASE_URL is not set; Prisma client is initialized with a placeholder connection string for build-time compatibility.')
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma