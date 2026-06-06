import React from 'react'
import BookEditClient from '@/app/books/[id]/components/BookEditClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  const book = await prisma.book.findUnique({
    where: { id: resolved.id },
    include: { author: true },
  })

  if (!book) throw new Error('Libro no encontrado')

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
