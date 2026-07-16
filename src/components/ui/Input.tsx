import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-white/70" htmlFor={id}>
      {label}
      <input
        id={id}
        className={`min-h-11 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/45 outline-none focus:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green ${className}`}
        {...props}
      />
    </label>
  )
}
