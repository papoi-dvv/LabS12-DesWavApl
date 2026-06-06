'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ImageWithFallback from '@/components/ImageWithFallback'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

type Author = {
  id: string
  name: string
  email: string
  nationality?: string
  birthYear?: number
  bio?: string
  imageUrl?: string | null
  imageData?: string | null
  books?: { id: string }[]
  _count?: { books: number }
}

const emptyForm = { name: '', email: '', nationality: '', birthYear: '', imageUrl: '', imageData: '' }

export default function AuthorsPanelClient({ initial }: { initial?: Author[] }) {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function fetchAuthors(showLoading = true) {
    if (showLoading) setLoading(true)
    try {
      const res = await fetch('/api/authors')
      const data = await res.json()
      if (!res.ok || !Array.isArray(data)) {
        setAuthors([])
        setError(data?.error || 'No se pudieron cargar los autores')
        return
      }
      setAuthors(data)
      setError(null)
    } catch (e) {
      console.error(e)
      setAuthors([])
      setError('No se pudieron cargar los autores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initial && Array.isArray(initial)) {
      setAuthors(initial)
      setLoading(false)
      return
    }
    void fetchAuthors(false)
  }, [initial])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        const res = await fetch(`/api/authors/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, birthYear: form.birthYear }) })
        if (res.ok) setEditingId(null)
      } else {
        const res = await fetch('/api/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, birthYear: form.birthYear }) })
        if (res.ok) setShowForm(false)
      }
      setForm(emptyForm)
      await fetchAuthors()
    } catch (err) { console.error(err) }
  }

  function readImageFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm(current => ({ ...current, imageData: String(reader.result || '') }))
    }
    reader.readAsDataURL(file)
  }

  async function remove(id: string) {
    if (!confirm('Eliminar autor?')) return
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    await fetchAuthors()
  }

  function startEdit(a: Author) {
    setEditingId(a.id)
    setForm({ name: a.name, email: a.email, nationality: a.nationality || '', birthYear: a.birthYear ? String(a.birthYear) : '', imageUrl: a.imageUrl || '', imageData: a.imageData || '' })
    setShowForm(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Autores</h2>
          <p className="mt-1 text-sm text-gray-600">Gestiona autores, nacionalidades y sus libros asociados.</p>
        </div>
        <button onClick={() => { setShowForm(s => !s); setEditingId(null); setForm(emptyForm) }} className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600">
          {showForm ? 'Cerrar formulario' : 'Crear autor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-base font-semibold text-gray-800">{editingId ? 'Editar autor' : 'Nuevo autor'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nombre" className="p-3" />
            <input required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" className="p-3" />
            <input value={form.nationality} onChange={(e) => setForm({...form, nationality: e.target.value})} placeholder="Nacionalidad" className="p-3" />
            <input value={form.birthYear} onChange={(e) => setForm({...form, birthYear: e.target.value})} placeholder="Año de nacimiento" className="p-3" />
            <input value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value, imageData: form.imageData})} placeholder="URL de imagen opcional" className="p-3 md:col-span-2" />
            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:bg-amber-50">
              Cargar imagen
              <input type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0])} className="hidden" />
            </label>
          </div>
          {(form.imageUrl || form.imageData) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">Imagen seleccionada</span>
              <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageData: '' })} className="rounded-full border border-red-200 px-3 py-1 font-semibold text-red-600 hover:bg-red-50">Quitar imagen</button>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button type="submit" className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">{editingId ? 'Guardar cambios' : 'Crear'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      )}

      <div>
        <div className="mb-3 text-sm font-medium text-gray-600">Total autores: {authors.length}</div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map(a => (
              <Card key={a.id} className="flex min-h-64 flex-col overflow-hidden p-0">
                <div className="relative h-36 bg-gray-100">
                  <ImageWithFallback src={a.imageData || a.imageUrl || null} kind="author" alt={a.name} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-gray-800">{a.name}</div>
                      <div className="mt-1 truncate text-sm text-gray-600">{a.email}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{a._count?.books ?? a.books?.length ?? 0} libros</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">{a.nationality || 'Nacionalidad pendiente'} · {a.birthYear || 'Año pendiente'}</div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Link href={`/authors/${a.id}`} className="rounded-full bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800">Ver</Link>
                    <button onClick={() => startEdit(a)} className="rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50">Editar</button>
                    <button onClick={() => remove(a.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Eliminar</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
