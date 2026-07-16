import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function Select({ label, id, className = '', children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-white/70" htmlFor={id}>
      {label}
      <select
        id={id}
        className={`min-h-11 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
