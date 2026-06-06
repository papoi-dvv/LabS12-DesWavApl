import React from 'react'
import ImageWithFallback from '@/components/ImageWithFallback'
import Link from 'next/link'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/books/${resolved.id}`, { cache: 'no-store' })
  if (!res.ok) return <div className="p-6 text-gray-700">Libro no encontrado</div>
  const book = await res.json()

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link href="/books" className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-white/10">Volver a libros</Link>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight">{book.title}</h1>
          <p className="mt-3 text-indigo-100">Ficha editorial y datos del catalogo.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-8 md:grid-cols-[300px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="relative aspect-[5/7] bg-gray-100">
            <ImageWithFallback src={book.cover || `/images/books/${book.id}.jpg`} kind="book" alt={book.title} fill className="object-cover" sizes="300px" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">{book.genre || 'Genero pendiente'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800">{book.title}</h2>
          <p className="mt-4 text-gray-600">{book.description || 'Este libro aun no tiene descripcion.'}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-100 p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">Autor</div>
              <Link href={`/authors/${book.author.id}`} className="mt-1 block truncate font-semibold text-amber-600">{book.author.name}</Link>
            </div>
            <div className="rounded-xl bg-gray-100 p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">Año</div>
              <div className="mt-1 font-semibold">{book.publishedYear || '—'}</div>
            </div>
            <div className="rounded-xl bg-gray-100 p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">Paginas</div>
              <div className="mt-1 font-semibold">{book.pages || '—'}</div>
            </div>
            <div className="rounded-xl bg-gray-100 p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">ISBN</div>
              <div className="mt-1 truncate font-semibold">{book.isbn || '—'}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/books/${book.id}/edit`} className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Editar</Link>
            <Link href="/books" className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Volver</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
