import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// En runtime la app debe usar DATABASE_URL; DIRECT_URL queda como respaldo local.
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set in the environment')
}

const pool = new Pool({ connectionString, // small timeouts to fail fast in dev
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
})

pool.on('error', (err) => {
  // Log pool-level errors to make diagnosis easier in dev
  // (node-postgres emits errors on idle clients)
  console.error('Postgres pool error:', err)
})

// Creamos el adaptador
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ahora sí, le pasamos el adaptador al constructor como exige Prisma 7
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
