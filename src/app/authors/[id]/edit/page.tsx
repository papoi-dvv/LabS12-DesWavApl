import React from 'react'
import AuthorEditClient from '@/app/authors/[id]/components/AuthorEditClient'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/authors/${resolvedParams.id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Autor no encontrado')
  const data = await res.json()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Editar autor</h1>
      <AuthorEditClient initial={data} />
    </div>
  )
}
