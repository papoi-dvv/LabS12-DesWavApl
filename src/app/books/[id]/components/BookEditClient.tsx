'use client'

import React, { useState } from 'react'

type EditableBook = {
  id: string
  title?: string | null
  description?: string | null
  isbn?: string | null
  genre?: string | null
  publishedYear?: number | string | null
  pages?: number | string | null
}

export default function BookEditClient({ initial }: { initial: EditableBook }) {
  const [form, setForm] = useState({ title: initial.title || '', description: initial.description || '', isbn: initial.isbn || '', genre: initial.genre || '', publishedYear: initial.publishedYear || '', pages: initial.pages || '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/books/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) location.href = `/books/${initial.id}`
    else {
      const err = await res.json().catch(()=>({ error: 'Error' }))
      alert(err.error || 'Error al guardar')
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="p-3" placeholder="Título" required />
      <textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="min-h-32 p-3" placeholder="Descripción" />
      <div className="grid gap-3 md:grid-cols-2">
        <input value={form.isbn} onChange={(e)=>setForm({...form, isbn: e.target.value})} className="p-3" placeholder="ISBN" />
        <input value={form.genre} onChange={(e)=>setForm({...form, genre: e.target.value})} className="p-3" placeholder="Género" />
        <input value={form.publishedYear} onChange={(e)=>setForm({...form, publishedYear: e.target.value})} className="p-3" placeholder="Año" />
        <input value={form.pages} onChange={(e)=>setForm({...form, pages: e.target.value})} className="p-3" placeholder="Páginas" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Guardar</button>
        <button type="button" onClick={()=>history.back()} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
      </div>
    </form>
  )
}
