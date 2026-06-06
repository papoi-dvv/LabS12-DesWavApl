import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Instanciamos el Pool de conexiones usando tu DATABASE_URL
const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })

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