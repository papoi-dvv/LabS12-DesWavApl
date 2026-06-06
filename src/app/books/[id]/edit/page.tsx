import React from 'react'
import BookEditClient from '@/app/books/[id]/components/BookEditClient'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/books/${resolved.id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Libro no encontrado')
  const book = await res.json()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Editar libro</h1>
      <BookEditClient initial={book} />
    </div>
  )
}
