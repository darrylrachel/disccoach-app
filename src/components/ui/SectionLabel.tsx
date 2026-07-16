import type { HTMLAttributes } from 'react'

export function SectionLabel({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs uppercase tracking-wide text-white/40 ${className}`} {...props} />
}
