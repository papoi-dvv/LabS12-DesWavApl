import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg ${className}`} {...props}>
      {children}
    </div>
  )
}
