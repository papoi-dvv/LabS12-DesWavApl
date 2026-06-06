import React from 'react'
import { prisma } from '@/lib/prisma'

import StatsPanelClient from './components/StatsPanelClient'
import AuthorEditClient from './components/AuthorEditClient'
import AddBookClient from './components/AddBookClient'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const resolved = await params
  const id = resolved.id

  const author = await prisma.author.findUnique({
    where: { id },
    include: { books: { orderBy: { publishedYear: 'desc' } } }
  })

  if (!author) {
    return <div className="p-6">Autor no encontrado</div>
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{author.name}</h1>
          <p className="text-sm text-gray-600">{author.email} • {author.nationality} • {author.birthYear}</p>
        </div>
        <div className="flex gap-2">
          <AuthorEditClient initial={author} />
          <AddBookClient authorId={author.id} />
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white p-4 border rounded">
          <h3 className="font-semibold mb-2">Estadísticas</h3>
          <StatsPanelClient authorId={author.id} />
        </div>
        <div className="md:col-span-2 bg-white p-4 border rounded">
          <h3 className="font-semibold mb-2">Libros ({author.books.length})</h3>
          <div className="grid gap-3">
            {author.books.map(b => (
              <div key={b.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-gray-600">{b.genre} • {b.publishedYear} • {b.pages} páginas</div>
                </div>
                <div className="flex gap-2">
                  <a href={`/books/${b.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">Ver</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
