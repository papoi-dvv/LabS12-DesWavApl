'use client'

import React, { useEffect, useState } from 'react'

type Author = {
  id: string
  name: string
  email: string
  nationality?: string
  birthYear?: number
  bio?: string
  books?: { id: string }[]
}

export default function AuthorsPanelClient() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', nationality: '', birthYear: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  async function fetchAuthors() {
    setLoading(true)
    try {
      const res = await fetch('/api/authors')
      const data = await res.json()
      setAuthors(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAuthors() }, [])

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
      setForm({ name: '', email: '', nationality: '', birthYear: '' })
      await fetchAuthors()
    } catch (err) { console.error(err) }
  }

  async function remove(id: string) {
    if (!confirm('Eliminar autor?')) return
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    await fetchAuthors()
  }

  function startEdit(a: Author) {
    setEditingId(a.id)
    setForm({ name: a.name, email: a.email, nationality: a.nationality || '', birthYear: a.birthYear ? String(a.birthYear) : '' })
    setShowForm(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Autores</h2>
          <p className="text-sm text-gray-600">Gestiona los autores de la biblioteca</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowForm(s => !s); setEditingId(null); setForm({ name: '', email: '', nationality: '', birthYear: '' }) }} className="px-4 py-2 bg-blue-600 text-white rounded">{showForm ? 'Cerrar' : 'Crear autor'}</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={submit} className="p-4 bg-white border rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nombre" className="border p-2 rounded" />
            <input required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" className="border p-2 rounded" />
            <input value={form.nationality} onChange={(e) => setForm({...form, nationality: e.target.value})} placeholder="Nacionalidad" className="border p-2 rounded" />
            <input value={form.birthYear} onChange={(e) => setForm({...form, birthYear: e.target.value})} placeholder="Año de nacimiento" className="border p-2 rounded" />
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editingId ? 'Guardar cambios' : 'Crear'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div>
        <div className="text-sm text-gray-600 mb-2">Total autores: {authors.length}</div>
        {loading ? (
          <div>Cargando autores...</div>
        ) : (
          <div className="grid gap-3">
            {authors.map(a => (
              <div key={a.id} className="p-3 bg-white border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-sm text-gray-600">{a.email} • {a.nationality} • {a.birthYear}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`/authors/${a.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">Ver</a>
                  <button onClick={() => startEdit(a)} className="px-3 py-1 bg-yellow-400 rounded">Editar</button>
                  <button onClick={() => remove(a.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
