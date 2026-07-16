import { useQuery } from '@tanstack/react-query'
import { getBag, listBagDiscs } from '../../../services/bags.service'

export function useBag(bagId: string | undefined) {
  return useQuery({
    queryKey: ['bag', bagId],
    queryFn: () => getBag(bagId!),
    enabled: !!bagId,
  })
}

export function useBagDiscs(bagId: string | undefined) {
  return useQuery({
    queryKey: ['bagDiscs', bagId],
    queryFn: () => listBagDiscs(bagId!),
    enabled: !!bagId,
  })
}
