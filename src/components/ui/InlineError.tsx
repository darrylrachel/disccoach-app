interface InlineErrorProps {
  message: string
  onRetry?: () => void
  retrying?: boolean
}

export function InlineError({ message, onRetry, retrying }: InlineErrorProps) {
  return (
    <p className="mt-3 flex items-center gap-3 text-sm text-red-400">
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="min-h-11 shrink-0 rounded-full border border-red-500/40 px-3 text-xs font-medium text-red-300 transition-colors hover:border-red-500/70 disabled:opacity-50"
        >
          {retrying ? 'Retrying…' : 'Retry'}
        </button>
      )}
    </p>
  )
}
