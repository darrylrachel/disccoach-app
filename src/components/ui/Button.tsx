import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'w-full min-h-11 rounded-lg px-4 py-3 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brand-green text-black hover:bg-brand-green/90',
    secondary: 'bg-transparent border border-white/20 text-white hover:border-white/40',
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
