import { useQuery } from '@tanstack/react-query'
import { getDisc } from '../../../services/discs.service'

export function useDisc(discId: string | undefined) {
  return useQuery({
    queryKey: ['disc', discId],
    queryFn: () => getDisc(discId!),
    enabled: !!discId,
  })
}
