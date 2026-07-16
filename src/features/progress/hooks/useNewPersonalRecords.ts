import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { NewPersonalRecordInput } from '../../../domain/progress/models'

// One-shot read of the PRs a just-completed session broke, stashed in the
// query cache by useCompletePracticeSession's onSuccess (see
// usePracticeMutations.ts). Reading from the cache — rather than router
// navigation state — survives the active-session screen unmounting before
// the completion mutation settles. Removed immediately after the first
// read so revisiting this session's summary later (e.g. from History)
// doesn't replay the celebration.
export function useNewPersonalRecords(sessionId: string | undefined): NewPersonalRecordInput[] {
  const queryClient = useQueryClient()

  const [records] = useState<NewPersonalRecordInput[]>(() => {
    if (!sessionId) return []
    const queryKey = ['newPersonalRecords', sessionId]
    const cached = queryClient.getQueryData<NewPersonalRecordInput[]>(queryKey) ?? []
    queryClient.removeQueries({ queryKey })
    return cached
  })

  return records
}
