import React from 'react'
import AuthorEditClient from '@/app/authors/[id]/components/AuthorEditClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const author = await prisma.author.findUnique({
    where: { id: resolvedParams.id },
    include: {
      books: {
        orderBy: {
          publishedYear: 'desc',
        },
      },
      _count: {
        select: { books: true },
      },
    },
  })

  if (!author) throw new Error('Autor no encontrado')

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-4xl font-semibold">Editar autor</h1>
          <p className="mt-3 text-indigo-100">{author.name}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-8">
        <AuthorEditClient initial={author} inline />
      </section>
    </main>
  )
}
