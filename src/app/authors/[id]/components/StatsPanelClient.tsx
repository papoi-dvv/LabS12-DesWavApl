'use client'

import React, { useEffect, useState } from 'react'

type Stats = {
  authorId: string
  authorName: string
  totalBooks: number
  firstBook: { title: string; year: number } | null
  latestBook: { title: string; year: number } | null
  averagePages: number
  genres: string[]
  longestBook: { title: string; pages: number } | null
  shortestBook: { title: string; pages: number } | null
}

export default function StatsPanelClient({ authorId, initial }: { authorId?: string; initial?: Stats }) {
  const [stats, setStats] = useState<Stats | null>(initial || null)
  const [loading, setLoading] = useState(initial ? false : true)

  useEffect(() => {
    if (initial) return
    if (!authorId) return
    fetch(`/api/authors/${authorId}/stats`).then(r=>r.json()).then(data=>{ setStats(data); setLoading(false) }).catch(e=>{console.error(e); setLoading(false)})
  }, [authorId, initial])

  if (loading) return <div className="text-sm text-gray-600">Cargando estadisticas...</div>
  if (!stats) return <div className="text-sm text-gray-600">No hay estadisticas</div>

  return (
    <div className="space-y-3 text-sm">
      <div className="rounded-xl bg-amber-50 p-4">
        <div className="text-xs font-semibold uppercase text-amber-700">Total libros</div>
        <div className="mt-1 text-3xl font-semibold text-gray-800">{stats.totalBooks}</div>
      </div>
      <div className="rounded-xl bg-gray-100 p-3"><strong>Primer libro:</strong> {stats.firstBook ? `${stats.firstBook.title} (${stats.firstBook.year})` : '—'}</div>
      <div className="rounded-xl bg-gray-100 p-3"><strong>Ultimo libro:</strong> {stats.latestBook ? `${stats.latestBook.title} (${stats.latestBook.year})` : '—'}</div>
      <div className="rounded-xl bg-gray-100 p-3"><strong>Paginas promedio:</strong> {stats.averagePages}</div>
      <div className="rounded-xl bg-gray-100 p-3"><strong>Generos:</strong> {stats.genres.join(', ') || '—'}</div>
      <div className="rounded-xl bg-gray-100 p-3"><strong>Libro mas largo:</strong> {stats.longestBook ? `${stats.longestBook.title} (${stats.longestBook.pages}p)` : '—'}</div>
      <div className="rounded-xl bg-gray-100 p-3"><strong>Libro mas corto:</strong> {stats.shortestBook ? `${stats.shortestBook.title} (${stats.shortestBook.pages}p)` : '—'}</div>
    </div>
  )
}
