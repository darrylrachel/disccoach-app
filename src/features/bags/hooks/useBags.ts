import { useQuery } from '@tanstack/react-query'
import { listBags } from '../../../services/bags.service'
import { useSession } from '../../auth/hooks/useSession'

export function useBags() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['bags', user?.id],
    queryFn: () => listBags(user!.id),
    enabled: !!user,
  })
}
