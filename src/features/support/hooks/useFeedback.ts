import { useMutation } from '@tanstack/react-query'
import { submitFeedback, type NewFeedbackInput } from '../../../services/feedback.service'
import { useSession } from '../../auth/hooks/useSession'

export function useSubmitFeedback() {
  const { user } = useSession()

  return useMutation({
    mutationFn: (input: NewFeedbackInput) => submitFeedback(user!.id, input),
  })
}
