'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import ImageWithFallback from '@/components/ImageWithFallback'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import BookEditClient from '@/app/books/[id]/components/BookEditClient'

type Author = { id: string; name: string }

type Book = {
  id: string
  title: string
  isbn?: string
  genre?: string
  publishedYear?: number
  pages?: number
  author?: { id: string; name: string }
  imageUrl?: string | null
  imageData?: string | null
}

export default function BooksManagerClient() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState<'createdAt'|'title'|'publishedYear'>('createdAt')
  const [order, setOrder] = useState<'asc'|'desc'>('desc')

  const [form, setForm] = useState({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', authorId: '', imageUrl: '', imageData: '' })
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  function readImageFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm(current => ({ ...current, imageData: String(reader.result || '') }))
    reader.readAsDataURL(file)
  }

  async function fetchAuthors() {
    try {
      const res = await fetch('/api/authors')
      const data = await res.json()
      setAuthors(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e); setAuthors([]) }
  }

  const fetchBooks = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (genre) params.set('genre', genre)
      const selectedAuthor = authors.find(author => author.id === authorId)
      if (selectedAuthor) params.set('authorName', selectedAuthor.name)
      params.set('page', String(p))
      params.set('limit', String(limit))
      params.set('sortBy', sortBy)
      params.set('order', order)

      const res = await fetch(`/api/books/search?${params.toString()}`)
      const json = await res.json()
      if (!res.ok || !Array.isArray(json.data) || !json.pagination) {
        setBooks([])
        setTotal(0)
        setPage(1)
        setTotalPages(1)
        setError(json?.error || 'No se pudieron cargar los libros')
        return
      }
      setBooks(json.data)
      setTotal(json.pagination.total ?? 0)
      setPage(json.pagination.page ?? 1)
      setTotalPages(json.pagination.totalPages ?? 1)
      setError(null)
    } catch (e) {
      console.error(e)
      setBooks([])
      setTotal(0)
      setPage(1)
      setTotalPages(1)
      setError('No se pudieron cargar los libros')
    } finally { setLoading(false) }
  }, [authors, authorId, genre, limit, order, page, search, sortBy])

  useEffect(() => {
    void fetchAuthors()
  }, [])

  useEffect(() => {
    void fetchBooks()
  }, [fetchBooks])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        title: form.title,
        isbn: form.isbn || undefined,
        imageUrl: form.imageUrl || undefined,
        imageData: form.imageData || undefined,
        genre: form.genre || undefined,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        pages: form.pages ? Number(form.pages) : undefined,
        authorId: form.authorId,
      }
      const res = await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', authorId: '', imageUrl: '', imageData: '' })
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
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Crear libro</h2>
          <p className="mt-1 text-sm text-gray-600">Registra un titulo y asocialo a un autor existente.</p>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Título" className="p-3" />
          <select required value={form.authorId} onChange={(e) => setForm({...form, authorId: e.target.value})} className="p-3">
            <option value="">Seleccionar autor</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input value={form.isbn} onChange={(e) => setForm({...form, isbn: e.target.value})} placeholder="ISBN" className="p-3" />
          <input value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})} placeholder="Género" className="p-3" />
          <input value={form.publishedYear} onChange={(e) => setForm({...form, publishedYear: e.target.value})} placeholder="Año" className="p-3" />
          <input value={form.pages} onChange={(e) => setForm({...form, pages: e.target.value})} placeholder="Páginas" className="p-3" />
          <input value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} placeholder="URL de imagen (opcional)" className="p-3" />
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:bg-amber-50">
            Cargar imagen
            <input type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0])} className="hidden" />
          </label>
          {(form.imageUrl || form.imageData) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 md:col-span-3">
              <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">Imagen seleccionada</span>
              <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageData: '' })} className="rounded-full border border-red-200 px-3 py-1 font-semibold text-red-600 hover:bg-red-50">Quitar imagen</button>
            </div>
          )}
          <div className="md:col-span-3 flex gap-2">
            <button className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Crear libro</button>
            <button type="button" onClick={() => setForm({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', authorId: '', imageUrl: '', imageData: '' })} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Limpiar</button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Libros</h2>
            <p className="mt-1 text-sm text-gray-600">Resultados totales: {total}</p>
          </div>
        </div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_160px_190px_140px_110px_auto]">
          <input placeholder="Buscar título..." value={search} onChange={(e)=> setSearch(e.target.value)} className="p-3" />
          <input placeholder="Género" value={genre} onChange={(e)=> setGenre(e.target.value)} className="p-3" />
          <select value={authorId} onChange={(e)=> setAuthorId(e.target.value)} className="p-3">
            <option value="">Todos los autores</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={sortBy} onChange={(e)=> setSortBy(e.target.value as 'createdAt' | 'title' | 'publishedYear')} className="p-3">
            <option value="createdAt">Creación</option>
            <option value="title">Título</option>
            <option value="publishedYear">Año</option>
          </select>
          <select value={order} onChange={(e)=> setOrder(e.target.value as 'asc' | 'desc')} className="p-3">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <button onClick={()=>fetchBooks(1)} className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Buscar</button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-80" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map(b => (
              <Card key={b.id} className="flex min-h-80 flex-col overflow-hidden p-0">
                <div className="relative h-44 bg-gray-100">
                  <ImageWithFallback src={b.imageData || b.imageUrl || null} kind="book" alt={b.title} fill className="object-cover" sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="truncate text-base font-semibold text-gray-800">{b.title}</div>
                  <div className="mt-1 truncate text-sm text-gray-600">{b.author?.name || 'Autor pendiente'}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">{b.genre || 'Sin genero'}</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{b.publishedYear || 'Sin año'}</span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Link href={`/books/${b.id}`} className="rounded-full bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800">Ver</Link>
                    <button onClick={() => setEditingBook(b)} className="rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50">Editar</button>
                    <button onClick={() => remove(b.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Eliminar</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {editingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={()=>setEditingBook(null)} />
            <div className="relative max-w-3xl w-full p-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold">Editar libro</h3>
                {/* @ts-ignore */}
                <BookEditClient initial={editingBook} onClose={()=>setEditingBook(null)} onSaved={async ()=>{ setEditingBook(null); await fetchBooks(1) }} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-center gap-3">
          <button disabled={page <= 1} onClick={() => fetchBooks(Math.max(1, page-1))} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Anterior</button>
          <div className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Página {page} de {totalPages}</div>
          <button disabled={page >= totalPages} onClick={() => fetchBooks(page+1)} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
        </div>

      </section>
    </div>
  )
}
