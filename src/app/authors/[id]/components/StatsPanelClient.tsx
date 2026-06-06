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

export default function StatsPanelClient({ authorId }: { authorId: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/authors/${authorId}/stats`).then(r=>r.json()).then(data=>{ setStats(data); setLoading(false) }).catch(e=>{console.error(e); setLoading(false)})
  }, [authorId])

  if (loading) return <div>Cargando estadísticas...</div>
  if (!stats) return <div>No hay estadísticas</div>

  return (
    <div className="space-y-2 text-sm">
      <div><strong>Total libros:</strong> {stats.totalBooks}</div>
      <div><strong>Primer libro:</strong> {stats.firstBook ? `${stats.firstBook.title} (${stats.firstBook.year})` : '—'}</div>
      <div><strong>Último libro:</strong> {stats.latestBook ? `${stats.latestBook.title} (${stats.latestBook.year})` : '—'}</div>
      <div><strong>Páginas promedio:</strong> {stats.averagePages}</div>
      <div><strong>Géneros:</strong> {stats.genres.join(', ') || '—'}</div>
      <div><strong>Libro más largo:</strong> {stats.longestBook ? `${stats.longestBook.title} (${stats.longestBook.pages}p)` : '—'}</div>
      <div><strong>Libro más corto:</strong> {stats.shortestBook ? `${stats.shortestBook.title} (${stats.shortestBook.pages}p)` : '—'}</div>
    </div>
  )
}
