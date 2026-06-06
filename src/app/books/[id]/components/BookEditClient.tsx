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
  imageUrl?: string | null
  imageData?: string | null
}

export default function BookEditClient({ initial, onClose, onSaved }: { initial: EditableBook; onClose?: () => void; onSaved?: (book: EditableBook | null) => void }) {
  const [form, setForm] = useState({ title: initial.title || '', description: initial.description || '', isbn: initial.isbn || '', genre: initial.genre || '', publishedYear: initial.publishedYear || '', pages: initial.pages || '', imageUrl: initial.imageUrl || '', imageData: initial.imageData || '' })

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
    const payload = { ...form, imageUrl: form.imageUrl || undefined, imageData: form.imageData || undefined }
    const res = await fetch(`/api/books/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const updated = await res.json().catch(()=>null)
      if (onSaved) onSaved(updated)
      else location.href = `/books/${initial.id}`
    } else {
      const err = await res.json().catch(()=>({ error: 'Error' }))
      alert(err.error || 'Error al guardar')
    }
  }

  function handleCancel() {
    if (onClose) onClose()
    else history.back()
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
        <input value={form.imageUrl} onChange={(e)=>setForm({...form, imageUrl: e.target.value})} className="p-3" placeholder="URL de imagen (opcional)" />
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:bg-amber-50">
          Cargar imagen
          <input type="file" accept="image/*" onChange={(e)=>readImageFile(e.target.files?.[0])} className="hidden" />
        </label>
        {(form.imageUrl || form.imageData) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">Imagen seleccionada</span>
            <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageData: '' })} className="rounded-full border border-red-200 px-3 py-1 font-semibold text-red-600 hover:bg-red-50">Quitar imagen</button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Guardar</button>
        <button type="button" onClick={handleCancel} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
      </div>
    </form>
  )
}
