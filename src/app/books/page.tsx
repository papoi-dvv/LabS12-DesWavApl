import React from 'react'

import BooksManagerClient from './components/BooksManagerClient'

export default function Page() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Libros</h1>
      <BooksManagerClient />
    </main>
  )
}
