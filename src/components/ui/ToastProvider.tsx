'use client'

import React, { createContext, useContext, useState } from 'react'

type Toast = { id: string; message: string; type?: 'success' | 'error' }

const ToastContext = createContext<any>(null)

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(message: string, type: Toast['type'] = 'success') {
    const id = String(Date.now())
    setToasts((s) => [...s, { id, message, type }])
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 4000)
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded shadow-sm text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-amber-500'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
