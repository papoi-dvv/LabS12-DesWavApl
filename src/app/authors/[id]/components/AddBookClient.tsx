'use client'

import React, { useState } from 'react'

export default function AddBookClient({ authorId }: { authorId: string }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', isbn: '', genre: '', publishedYear: '', pages: '', imageUrl: '', imageData: '' })

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

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.title, isbn: form.isbn || undefined, imageUrl: form.imageUrl || undefined, imageData: form.imageData || undefined, genre: form.genre || undefined, publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined, pages: form.pages ? Number(form.pages) : undefined, authorId }) })
    if (res.ok) { setOpen(false); location.reload() } else { const err = await res.json(); alert(err.error || 'Error') }
  }

  return (
    <div>
      <button onClick={()=>setOpen(true)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Añadir libro</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Añadir libro</h3>
            <div className="grid gap-3">
              <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} placeholder="Título" className="p-3" required />
              <input value={form.isbn} onChange={(e)=>setForm({...form, isbn: e.target.value})} placeholder="ISBN" className="p-3" />
              <input value={form.genre} onChange={(e)=>setForm({...form, genre: e.target.value})} placeholder="Género" className="p-3" />
              <input value={form.publishedYear} onChange={(e)=>setForm({...form, publishedYear: e.target.value})} placeholder="Año" className="p-3" />
              <input value={form.pages} onChange={(e)=>setForm({...form, pages: e.target.value})} placeholder="Páginas" className="p-3" />
              <input value={form.imageUrl} onChange={(e)=>setForm({...form, imageUrl: e.target.value})} placeholder="URL de imagen (opcional)" className="p-3" />
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:bg-amber-50">
                Cargar imagen
                <input type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0])} className="hidden" />
              </label>
              {(form.imageUrl || form.imageData) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">Imagen seleccionada</span>
                  <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageData: '' })} className="rounded-full border border-red-200 px-3 py-1 font-semibold text-red-600 hover:bg-red-50">Quitar imagen</button>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Crear</button>
              <button type="button" onClick={()=>setOpen(false)} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
