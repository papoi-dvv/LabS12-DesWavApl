'use client'

import React, { useState } from 'react'

type EditableAuthor = {
  id: string
  name: string
  email: string
  nationality?: string | null
  birthYear?: number | null
  bio?: string | null
  imageUrl?: string | null
  imageData?: string | null
}

export default function AuthorEditClient({ initial, inline = false }: { initial: EditableAuthor; inline?: boolean }) {
  const [open, setOpen] = useState(inline)
  const [form, setForm] = useState({ name: initial.name, email: initial.email, nationality: initial.nationality || '', birthYear: initial.birthYear ? String(initial.birthYear) : '', bio: initial.bio || '', imageUrl: initial.imageUrl || '', imageData: initial.imageData || '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/authors/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, birthYear: form.birthYear }) })
    if (res.ok) { setOpen(false); location.reload() } else { alert('Error al actualizar') }
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

  const formContent = (
    <form onSubmit={submit} className={`${inline ? 'w-full' : 'w-full max-w-md'} rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100`}>
      <h3 className="mb-4 text-xl font-semibold text-gray-800">Editar autor</h3>
      <div className="grid gap-3">
        <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="p-3" placeholder="Nombre" />
        <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="p-3" placeholder="Email" />
        <input value={form.nationality} onChange={(e)=>setForm({...form, nationality: e.target.value})} className="p-3" placeholder="Nacionalidad" />
        <input value={form.birthYear} onChange={(e)=>setForm({...form, birthYear: e.target.value})} className="p-3" placeholder="Año de nacimiento" />
        <input value={form.imageUrl} onChange={(e)=>setForm({...form, imageUrl: e.target.value})} className="p-3" placeholder="URL de imagen opcional" />
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:bg-amber-50">
          Cargar imagen desde archivo
          <input type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0])} className="hidden" />
        </label>
        {(form.imageUrl || form.imageData) && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">Imagen seleccionada</span>
            <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageData: '' })} className="rounded-full border border-red-200 px-3 py-1 font-semibold text-red-600 hover:bg-red-50">Quitar imagen</button>
          </div>
        )}
        <textarea value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} className="min-h-32 p-3" placeholder="Biografia" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Guardar</button>
        <button type="button" onClick={()=> inline ? history.back() : setOpen(false)} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
      </div>
    </form>
  )

  if (inline) return formContent

  return (
    <div>
      <button onClick={()=>setOpen(true)} className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">Editar</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          {formContent}
        </div>
      )}
    </div>
  )
}
