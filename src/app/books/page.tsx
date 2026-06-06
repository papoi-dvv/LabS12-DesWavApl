import React from 'react'
import Link from 'next/link'

import BooksManagerClient from './components/BooksManagerClient'

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link href="/" className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-white/10">
            Volver a autores
          </Link>
          <h1 className="text-4xl font-semibold">Catalogo de libros</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Explora y administra la colección de libros disponibles. Filtra los resultados en tiempo real, accede al detalle de cada obra o actualiza la información del catálogo.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <BooksManagerClient />
      </section>
    </main>
  )
}
