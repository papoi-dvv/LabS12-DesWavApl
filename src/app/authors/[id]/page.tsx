import React from 'react'
import Link from 'next/link'
import ImageWithFallback from '@/components/ImageWithFallback'
import { prisma } from '@/lib/prisma'

import StatsPanelClient from './components/StatsPanelClient'
import AuthorEditClient from './components/AuthorEditClient'
import AddBookClient from './components/AddBookClient'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const [author, aggregateStats, firstBook, latestBook, longestBook, shortestBook, genresByName] = await Promise.all([
    prisma.author.findUnique({
      where: { id },
      include: { books: { orderBy: { publishedYear: 'desc' } } },
    }),
    prisma.book.aggregate({
      where: { authorId: id },
      _count: { _all: true },
      _avg: { pages: true },
    }),
    prisma.book.findFirst({
      where: { authorId: id, publishedYear: { not: null } },
      orderBy: { publishedYear: 'asc' },
      select: { title: true, publishedYear: true },
    }),
    prisma.book.findFirst({
      where: { authorId: id, publishedYear: { not: null } },
      orderBy: { publishedYear: 'desc' },
      select: { title: true, publishedYear: true },
    }),
    prisma.book.findFirst({
      where: { authorId: id, pages: { not: null } },
      orderBy: { pages: 'desc' },
      select: { title: true, pages: true },
    }),
    prisma.book.findFirst({
      where: { authorId: id, pages: { not: null } },
      orderBy: { pages: 'asc' },
      select: { title: true, pages: true },
    }),
    prisma.book.groupBy({
      by: ['genre'],
      where: { authorId: id, genre: { not: null } },
    }),
  ])

  if (!author) {
    return <div className="p-6 text-gray-700">Autor no encontrado</div>
  }

  const stats = {
    authorId: id,
    authorName: author.name,
    totalBooks: aggregateStats._count._all,
    firstBook: firstBook ? { title: firstBook.title, year: firstBook.publishedYear } : null,
    latestBook: latestBook ? { title: latestBook.title, year: latestBook.publishedYear } : null,
    averagePages: aggregateStats._avg.pages ? Math.round(aggregateStats._avg.pages) : 0,
    genres: genresByName.map(({ genre }) => genre).filter((genre): genre is string => Boolean(genre)),
    longestBook: longestBook ? { title: longestBook.title, pages: longestBook.pages } : null,
    shortestBook: shortestBook ? { title: shortestBook.title, pages: shortestBook.pages } : null,
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-8 md:grid-cols-[180px_1fr] md:items-end">
          <div className="overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
            <div className="relative aspect-square">
              <ImageWithFallback src={author.imageData || author.imageUrl || null} kind="author" alt={author.name} fill className="object-cover" sizes="180px" />
            </div>
          </div>
          <div>
            <Link href="/" className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-white/10">Volver a autores</Link>
            <h1 className="text-4xl font-semibold">{author.name}</h1>
            <p className="mt-3 text-indigo-100">{author.email} · {author.nationality || 'Nacionalidad pendiente'} · {author.birthYear || 'Año pendiente'}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <AuthorEditClient initial={author} />
              <AddBookClient authorId={author.id} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Estadisticas</h2>
          <StatsPanelClient initial={stats} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Libros ({author.books.length})</h2>
          <div className="grid gap-3">
            {author.books.map(b => (
              <div key={b.id} className="flex flex-col gap-3 rounded-xl bg-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-gray-800">{b.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{b.genre || 'Sin genero'} · {b.publishedYear || 'Sin año'} · {b.pages || '—'} paginas</div>
                </div>
                <Link href={`/books/${b.id}`} className="inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800">Ver</Link>
              </div>
            ))}
            {author.books.length === 0 && (
              <div className="rounded-xl bg-gray-100 p-5 text-sm text-gray-600">Este autor aun no tiene libros registrados.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
