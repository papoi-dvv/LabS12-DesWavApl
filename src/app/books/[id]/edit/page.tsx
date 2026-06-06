import React from 'react'
import BookEditClient from '@/app/books/[id]/components/BookEditClient'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  const base = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`
  const res = await fetch(`${base}/api/books/${resolved.id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Libro no encontrado')
  const book = await res.json()

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-4xl font-semibold">Editar libro</h1>
          <p className="mt-3 text-indigo-100">{book.title}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <BookEditClient initial={book} />
        </div>
      </section>
    </main>
  )
}
