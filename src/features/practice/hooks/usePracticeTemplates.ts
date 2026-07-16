import { useQuery } from '@tanstack/react-query'
import { getPracticeTemplate, listPracticeTemplates } from '../../../services/practice.service'
import type { PracticeCategory } from '../../../domain/practice/models'

export function usePracticeTemplates(category?: PracticeCategory) {
  return useQuery({
    queryKey: ['practiceTemplates', category],
    queryFn: () => listPracticeTemplates(category),
  })
}

export function usePracticeTemplate(templateId: string | null | undefined) {
  return useQuery({
    queryKey: ['practiceTemplate', templateId],
    queryFn: () => getPracticeTemplate(templateId!),
    enabled: !!templateId,
  })
}
