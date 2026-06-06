import React from 'react'
import AuthorsPanelClient from './components/AuthorsPanelClient'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const authors = await prisma.author.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { books: true } } } })
  return (
    <main className="min-h-screen">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">Biblioteca Digital</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Autores, libros y lecturas en un solo lugar</h1>
            <p className="mt-4 text-base text-indigo-100">Gestiona el catalogo con una experiencia visual, clara y preparada para portadas y fotografias.</p>
          </div>
          <Link href="/books" className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600">
            Ver libros
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* pass authors as initial to avoid client fetch */}
        <AuthorsPanelClient initial={authors} />
      </section>
    </main>
  )
}
