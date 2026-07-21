import { useQuery } from '@tanstack/react-query'
import { listBagDiscIdsForUser } from '../../../services/bags.service'
import { groupDiscsByMold } from '../../../domain/disc/collection'
import { useSession } from '../../auth/hooks/useSession'
import { useDiscs } from './useDiscs'

function useUserBagDiscIds() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['bagDiscIds', user?.id],
    queryFn: () => listBagDiscIdsForUser(user!.id),
    enabled: !!user,
  })
}

export function useDiscCollection() {
  const discsQuery = useDiscs({ status: 'active' })
  const bagDiscIdsQuery = useUserBagDiscIds()

  const groups =
    discsQuery.data && bagDiscIdsQuery.data ? groupDiscsByMold(discsQuery.data, bagDiscIdsQuery.data) : undefined

  return {
    groups,
    isLoading: discsQuery.isLoading || bagDiscIdsQuery.isLoading,
    isError: discsQuery.isError || bagDiscIdsQuery.isError,
  }
}
