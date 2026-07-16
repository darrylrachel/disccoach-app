import { useNavigate } from 'react-router-dom'

export function BackLink() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-6 inline-flex min-h-11 items-center text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
    >
      ← Back
    </button>
  )
}
