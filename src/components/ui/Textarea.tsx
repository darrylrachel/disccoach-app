import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-white/70" htmlFor={id}>
      {label}
      <textarea
        id={id}
        className={`min-h-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/45 outline-none focus:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green ${className}`}
        {...props}
      />
    </label>
  )
}
