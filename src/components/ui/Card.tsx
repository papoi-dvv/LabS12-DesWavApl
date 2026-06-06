import React from 'react'

export default function Card({ children, className = '' }: any) {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition p-4 ${className}`}>
      {children}
    </div>
  )
}
