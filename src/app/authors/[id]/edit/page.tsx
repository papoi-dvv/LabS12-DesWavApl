import React from 'react'
import AuthorEditClient from '@/app/authors/[id]/components/AuthorEditClient'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const base = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`
  const res = await fetch(`${base}/api/authors/${resolvedParams.id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Autor no encontrado')
  const data = await res.json()

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-4xl font-semibold">Editar autor</h1>
          <p className="mt-3 text-indigo-100">{data.name}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-8">
        <AuthorEditClient initial={data} inline />
      </section>
    </main>
  )
}
