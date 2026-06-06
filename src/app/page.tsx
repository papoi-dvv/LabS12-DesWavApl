import React from 'react'
import AuthorsPanelClient from './components/AuthorsPanelClient'

export default function Home() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Library Dashboard</h1>
      <AuthorsPanelClient />
    </main>
  )
}
