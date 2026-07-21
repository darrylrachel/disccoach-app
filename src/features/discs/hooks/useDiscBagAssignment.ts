import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getBagAssignmentForDisc,
  moveDiscToBag,
  removeDiscFromBag,
} from '../../../services/bags.service'
import type { BagSlot } from '../../../domain/bag/models'
import { useSession } from '../../auth/hooks/useSession'

export function useDiscBagAssignment(discId: string | undefined) {
  return useQuery({
    queryKey: ['discBagAssignment', discId],
    queryFn: () => getBagAssignmentForDisc(discId!),
    enabled: !!discId,
  })
}

function useInvalidateBagAssignment(discId: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ['discBagAssignment', discId] })
    // Which bag(s) changed isn't known here (old + new), so invalidate every
    // open bagDiscs query — same broad-invalidation approach useSetActiveBag
    // uses for 'bag' when a DB trigger has side effects beyond the one row.
    queryClient.invalidateQueries({ queryKey: ['bagDiscs'] })
    queryClient.invalidateQueries({ queryKey: ['bagDiscIds', user?.id] })
  }
}

export function useMoveDiscBagSlot(discId: string) {
  const invalidate = useInvalidateBagAssignment(discId)

  return useMutation({
    mutationFn: ({ bagId, slot }: { bagId: string; slot: BagSlot }) => moveDiscToBag(discId, bagId, slot),
    onSuccess: invalidate,
  })
}

export function useRemoveDiscFromBagAssignment(discId: string) {
  const invalidate = useInvalidateBagAssignment(discId)

  return useMutation({
    mutationFn: (bagDiscId: string) => removeDiscFromBag(bagDiscId),
    onSuccess: invalidate,
  })
}
