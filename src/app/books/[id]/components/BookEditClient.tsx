'use client'

import React, { useState } from 'react'

export default function BookEditClient({ initial }: any) {
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
    <form onSubmit={submit} className="max-w-lg space-y-3">
      <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="border p-2 rounded" placeholder="Título" required />
      <textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="border p-2 rounded" placeholder="Descripción" />
      <input value={form.isbn} onChange={(e)=>setForm({...form, isbn: e.target.value})} className="border p-2 rounded" placeholder="ISBN" />
      <input value={form.genre} onChange={(e)=>setForm({...form, genre: e.target.value})} className="border p-2 rounded" placeholder="Género" />
      <input value={form.publishedYear} onChange={(e)=>setForm({...form, publishedYear: e.target.value})} className="border p-2 rounded" placeholder="Año" />
      <input value={form.pages} onChange={(e)=>setForm({...form, pages: e.target.value})} className="border p-2 rounded" placeholder="Páginas" />
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-amber-500 text-white rounded-full">Guardar</button>
        <button type="button" onClick={()=>history.back()} className="px-4 py-2 bg-gray-200 rounded-full">Cancelar</button>
      </div>
    </form>
  )
}
