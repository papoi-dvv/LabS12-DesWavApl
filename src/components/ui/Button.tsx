import React from 'react'

export default function Button({ children, variant = 'primary', ...props }: any) {
  const base = 'px-4 py-2 rounded-full font-medium'
  const variants: Record<string, string> = {
    primary: `${base} bg-amber-500 text-white`,
    secondary: `${base} bg-transparent border border-amber-500 text-amber-500`,
    destructive: `${base} bg-red-600 text-white`,
  }

  return (
    <button className={variants[variant] || variants.primary} {...props}>{children}</button>
  )
}
