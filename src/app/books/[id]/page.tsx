import React from 'react'
import ImageWithFallback from '@/components/ImageWithFallback'
import Link from 'next/link'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/books/${resolved.id}`, { cache: 'no-store' })
  if (!res.ok) return <div className="p-6">Libro no encontrado</div>
  const book = await res.json()

  return (
    <div className="p-6 max-w-4xl">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <ImageWithFallback src={book.cover || null} kind="book" alt={book.title} width={300} height={420} />
        </div>
        <div className="col-span-2">
          <h1 className="text-2xl font-semibold text-gray-800">{book.title}</h1>
          <p className="text-gray-600">{book.description}</p>
          <div className="mt-4">
            <p><strong>Autor:</strong> <Link href={`/authors/${book.author.id}`} className="text-amber-500">{book.author.name}</Link></p>
            <p><strong>Año:</strong> {book.publishedYear || '—'}</p>
            <p><strong>Páginas:</strong> {book.pages || '—'}</p>
            <p><strong>Género:</strong> {book.genre || '—'}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/books/${book.id}/edit`} className="px-4 py-2 bg-amber-500 text-white rounded-full">Editar</Link>
              <Link href="/books" className="px-4 py-2 bg-gray-200 rounded-full">Volver</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
