import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Página no encontrada</h1>
        <p className="text-gray-600 mb-4">Lo sentimos, la ruta que buscas no existe o fue movida.</p>
        <Link href="/" className="inline-block px-6 py-2 bg-amber-500 text-white rounded-full">Volver al inicio</Link>
      </div>
    </main>
  )
}
