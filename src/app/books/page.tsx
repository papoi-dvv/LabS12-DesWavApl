import React from 'react'
import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import BooksManagerClient from './components/BooksManagerClient'

export const dynamic = 'force-dynamic'

type BooksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type SortBy = 'title' | 'publishedYear' | 'createdAt'
type SortOrder = 'asc' | 'desc'

const validSortFields = new Set<SortBy>(['title', 'publishedYear', 'createdAt'])
const validSortOrders = new Set<SortOrder>(['asc', 'desc'])

function getSingleParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

function getPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

export default async function Page({ searchParams }: BooksPageProps) {
  const params = await searchParams
  const search = getSingleParam(params, 'search') ?? ''
  const genre = getSingleParam(params, 'genre') || undefined
  const authorName = getSingleParam(params, 'authorName') ?? ''
  const page = getPositiveInteger(getSingleParam(params, 'page'), 1)
  const limitRaw = getPositiveInteger(getSingleParam(params, 'limit'), 12)
  const limit = Math.min(limitRaw, 50)
  const requestedSortBy = getSingleParam(params, 'sortBy') as SortBy | undefined
  const requestedOrder = getSingleParam(params, 'order') as SortOrder | undefined
  const sortBy = requestedSortBy && validSortFields.has(requestedSortBy) ? requestedSortBy : 'createdAt'
  const order = requestedOrder && validSortOrders.has(requestedOrder) ? requestedOrder : 'desc'

  const where: Prisma.BookWhereInput = {}
  if (search) where.title = { contains: search, mode: 'insensitive' }
  if (genre) where.genre = genre
  if (authorName) where.author = { name: { contains: authorName, mode: 'insensitive' } }

  const [total, books, authors] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({ where, include: { author: { select: { id: true, name: true } } }, orderBy: { [sortBy]: order }, skip: (page - 1) * limit, take: limit }),
    prisma.author.findMany({ select: { id: true, name: true } }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <main className="min-h-screen">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link href="/" className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-white/10">
            Volver a autores
          </Link>
          <h1 className="text-4xl font-semibold">Catalogo de libros</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Explora y administra la colección de libros disponibles. Filtra los resultados en tiempo real, accede al detalle de cada obra o actualiza la información del catálogo.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <BooksManagerClient initialAuthors={authors} initialBooks={books} initialPagination={{ page, total, totalPages }} />
      </section>
    </main>
  )
}
