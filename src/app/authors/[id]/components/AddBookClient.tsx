'use client'

import React, { useState } from 'react'

export default function AddBookClient({ authorId }: { authorId: string }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', isbn: '', genre: '', publishedYear: '', pages: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, authorId }
    const res = await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.title, isbn: form.isbn || undefined, genre: form.genre || undefined, publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined, pages: form.pages ? Number(form.pages) : undefined, authorId }) })
    if (res.ok) { setOpen(false); location.reload() } else { const err = await res.json(); alert(err.error || 'Error') }
  }

  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-3 py-1 bg-green-600 text-white rounded">Añadir libro</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form onSubmit={submit} className="bg-white p-4 rounded w-full max-w-md">
            <h3 className="font-semibold mb-2">Añadir libro a {authorId}</h3>
            <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} placeholder="Título" className="border p-2 rounded w-full mb-2" required />
            <input value={form.isbn} onChange={(e)=>setForm({...form, isbn: e.target.value})} placeholder="ISBN" className="border p-2 rounded w-full mb-2" />
            <input value={form.genre} onChange={(e)=>setForm({...form, genre: e.target.value})} placeholder="Género" className="border p-2 rounded w-full mb-2" />
            <input value={form.publishedYear} onChange={(e)=>setForm({...form, publishedYear: e.target.value})} placeholder="Año" className="border p-2 rounded w-full mb-2" />
            <input value={form.pages} onChange={(e)=>setForm({...form, pages: e.target.value})} placeholder="Páginas" className="border p-2 rounded w-full mb-2" />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Crear</button>
              <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1 bg-gray-200 rounded">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
