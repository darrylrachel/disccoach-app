import { useQuery } from '@tanstack/react-query'
import { listDiscs, type ListDiscsFilters } from '../../../services/discs.service'
import { useSession } from '../../auth/hooks/useSession'

export function useDiscs(filters: ListDiscsFilters = {}) {
  const { user } = useSession()

  return useQuery({
    queryKey: ['discs', user?.id, filters],
    queryFn: () => listDiscs(user!.id, filters),
    enabled: !!user,
  })
}
