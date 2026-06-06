import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-60'
  const variants: Record<string, string> = {
    primary: `${base} bg-amber-500 text-white hover:bg-amber-600`,
    secondary: `${base} border border-amber-500 bg-white text-amber-600 hover:bg-amber-50`,
    ghost: `${base} bg-transparent text-gray-700 shadow-none hover:bg-gray-100`,
    destructive: `${base} border border-red-200 bg-white text-red-600 hover:bg-red-50`,
  }

  return (
    <button className={variants[variant]} {...props}>{children}</button>
  )
}
