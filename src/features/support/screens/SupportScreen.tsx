import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { BackLink } from '../components/BackLink'
import { useSubmitFeedback } from '../hooks/useFeedback'
import type { NewFeedbackInput } from '../../../services/feedback.service'

const CATEGORY_OPTIONS: { value: NewFeedbackInput['category']; label: string }[] = [
  { value: 'bug', label: 'Bug report' },
  { value: 'feature_request', label: 'Feature request' },
  { value: 'general', label: 'General feedback' },
]

export function SupportScreen() {
  const [category, setCategory] = useState<NewFeedbackInput['category']>('general')
  const [message, setMessage] = useState('')
  const submitFeedback = useSubmitFeedback()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!message.trim()) return
    submitFeedback.mutate(
      { category, message: message.trim() },
      { onSuccess: () => setMessage('') },
    )
  }

  return (
    <div className="px-6 py-8 pb-24">
      <BackLink />
      <h1 className="mb-2 text-2xl font-bold text-white">Support</h1>
      <p className="mb-8 text-sm text-white/60">
        Found a bug or have an idea? Send it directly to the team — every report during the beta helps.
      </p>

      {submitFeedback.isSuccess && (
        <div className="mb-6 rounded-xl border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-brand-green">
          Thanks — your feedback was sent.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Select
          id="feedbackCategory"
          label="Type"
          value={category}
          onChange={(e) => setCategory(e.target.value as NewFeedbackInput['category'])}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <label className="flex flex-col gap-1.5 text-sm text-white/70" htmlFor="feedbackMessage">
          Message
          <textarea
            id="feedbackMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="What happened, or what would help?"
            className="min-h-28 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/45 outline-none focus:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green"
          />
        </label>

        <Button type="submit" disabled={!message.trim() || submitFeedback.isPending}>
          {submitFeedback.isPending ? 'Sending…' : 'Send feedback'}
        </Button>
        {submitFeedback.isError && (
          <p className="text-sm text-red-400">Unable to send that right now. Please try again.</p>
        )}
      </form>

      <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
        <p>Prefer email? Reach the team at support@disccoach.app.</p>
      </div>
    </div>
  )
}
