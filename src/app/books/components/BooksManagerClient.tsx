'use client'

import React, { useEffect, useState } from 'react'

type Author = { id: string; name: string }

type Book = {
  id: string
  title: string
  isbn?: string
  genre?: string
  publishedYear?: number
  pages?: number
  author?: { id: string; name: string }
}

export default function BooksManagerClient() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState<'createdAt'|'title'|'publishedYear'>('createdAt')
  const [order, setOrder] = useState<'asc'|'desc'>('desc')

  const [form, setForm] = useState({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', authorId: '' })

  useEffect(() => { fetchAuthors(); fetchBooks() }, [])

  async function fetchAuthors() {
    try {
      const res = await fetch('/api/authors')
      const data = await res.json()
      setAuthors(data)
    } catch (e) { console.error(e) }
  }

  async function fetchBooks(p = page) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (genre) params.set('genre', genre)
      if (authorId) params.set('authorId', authorId)
      params.set('page', String(p))
      params.set('limit', String(limit))
      params.set('sortBy', sortBy)
      params.set('order', order)

      const res = await fetch(`/api/books/search?${params.toString()}`)
      const json = await res.json()
      setBooks(json.data)
      setTotal(json.pagination.total)
      setPage(json.pagination.page)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        title: form.title,
        isbn: form.isbn || undefined,
        genre: form.genre || undefined,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        pages: form.pages ? Number(form.pages) : undefined,
        authorId: form.authorId,
      }
      const res = await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', authorId: '' })
        await fetchBooks(1)
      } else {
        const err = await res.json()
        alert(err.error || 'Error')
      }
    } catch (e) { console.error(e) }
  }

  async function remove(id: string) {
    if (!confirm('Eliminar libro?')) return
    await fetch(`/api/books/${id}`, { method: 'DELETE' })
    await fetchBooks()
  }

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white border rounded">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Título" className="border p-2 rounded" />
          <select required value={form.authorId} onChange={(e) => setForm({...form, authorId: e.target.value})} className="border p-2 rounded">
            <option value="">Seleccionar autor</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input value={form.isbn} onChange={(e) => setForm({...form, isbn: e.target.value})} placeholder="ISBN" className="border p-2 rounded" />
          <input value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})} placeholder="Género" className="border p-2 rounded" />
          <input value={form.publishedYear} onChange={(e) => setForm({...form, publishedYear: e.target.value})} placeholder="Año" className="border p-2 rounded" />
          <input value={form.pages} onChange={(e) => setForm({...form, pages: e.target.value})} placeholder="Páginas" className="border p-2 rounded" />
          <div className="md:col-span-3 flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Crear libro</button>
            <button type="button" onClick={() => setForm({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', authorId: '' })} className="px-4 py-2 bg-gray-200 rounded">Limpiar</button>
          </div>
        </form>
      </section>

      <section className="p-4 bg-white border rounded">
        <div className="flex gap-2 mb-3">
          <input placeholder="Buscar título..." value={search} onChange={(e)=> setSearch(e.target.value)} className="border p-2 rounded flex-1" />
          <input placeholder="Género" value={genre} onChange={(e)=> setGenre(e.target.value)} className="border p-2 rounded w-48" />
          <select value={sortBy} onChange={(e)=> setSortBy(e.target.value as any)} className="border p-2 rounded">
            <option value="createdAt">Creación</option>
            <option value="title">Título</option>
            <option value="publishedYear">Año</option>
          </select>
          <select value={order} onChange={(e)=> setOrder(e.target.value as any)} className="border p-2 rounded">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <button onClick={()=>fetchBooks(1)} className="px-3 py-2 bg-blue-600 text-white rounded">Buscar</button>
        </div>

        <div className="text-sm text-gray-600 mb-2">Resultados totales: {total}</div>

        {loading ? <div>Cargando...</div> : (
          <div className="grid gap-3">
            {books.map(b => (
              <div key={b.id} className="p-3 bg-white border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-gray-600">{b.author?.name} • {b.genre} • {b.publishedYear}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`/books/${b.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">Ver</a>
                  <button onClick={() => remove(b.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => fetchBooks(Math.max(1, page-1))} className="px-3 py-1 bg-gray-200 rounded">Anterior</button>
          <div>Página {page}</div>
          <button onClick={() => fetchBooks(page+1)} className="px-3 py-1 bg-gray-200 rounded">Siguiente</button>
        </div>

      </section>
    </div>
  )
}
