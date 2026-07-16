import { useQuery } from '@tanstack/react-query'
import { listPersonalRecords } from '../../../services/progress.service'
import { useSession } from '../../auth/hooks/useSession'

export function usePersonalRecords() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['personalRecords', user?.id],
    queryFn: () => listPersonalRecords(user!.id),
    enabled: !!user,
  })
}
