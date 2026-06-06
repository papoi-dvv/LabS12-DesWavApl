"use client"

import React from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Algo salió mal</h2>
        <p className="text-gray-600 mb-4">{error?.message || 'Error inesperado'}</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => reset()} className="px-4 py-2 bg-amber-500 text-white rounded-full">Reintentar</button>
        </div>
      </div>
    </div>
  )
}
