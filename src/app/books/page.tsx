import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

import BooksManagerClient from './components/BooksManagerClient'

export default async function Page({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const params = searchParams || {}
  const search = typeof params.search === 'string' ? params.search : ''
  const genre = typeof params.genre === 'string' ? params.genre : undefined
  const authorName = typeof params.authorName === 'string' ? params.authorName : ''
  const page = Math.max(1, Number(params.page || 1))
  const limitRaw = Math.max(1, Number(params.limit || 10))
  const limit = Math.min(limitRaw, 50)
  const sortBy = (typeof params.sortBy === 'string' ? params.sortBy : 'createdAt') as 'title' | 'publishedYear' | 'createdAt'
  const order = (typeof params.order === 'string' ? params.order : 'desc') as 'asc' | 'desc'

  const where: any = {}
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
