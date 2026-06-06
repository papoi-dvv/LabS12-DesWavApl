'use client'

import React, { useState } from 'react'

export default function AuthorEditClient({ initial }: any) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: initial.name, email: initial.email, nationality: initial.nationality || '', birthYear: initial.birthYear ? String(initial.birthYear) : '', bio: initial.bio || '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/authors/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, birthYear: form.birthYear }) })
    if (res.ok) { setOpen(false); location.reload() } else { alert('Error al actualizar') }
  }

  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-3 py-1 bg-yellow-400 rounded">Editar</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form onSubmit={submit} className="bg-white p-4 rounded w-full max-w-md">
            <h3 className="font-semibold mb-2">Editar autor</h3>
            <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="border p-2 rounded w-full mb-2" />
            <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="border p-2 rounded w-full mb-2" />
            <input value={form.nationality} onChange={(e)=>setForm({...form, nationality: e.target.value})} className="border p-2 rounded w-full mb-2" />
            <input value={form.birthYear} onChange={(e)=>setForm({...form, birthYear: e.target.value})} className="border p-2 rounded w-full mb-2" />
            <textarea value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} className="border p-2 rounded w-full mb-2" />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Guardar</button>
              <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1 bg-gray-200 rounded">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
