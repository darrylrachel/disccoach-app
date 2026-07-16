import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addDiscToBag,
  createBag,
  deleteBag,
  removeDiscFromBag,
  setActiveBag,
  updateBag,
  updateBagDiscSlot,
} from '../../../services/bags.service'
import type { BagSlot, BagUpdateInput, NewBagInput } from '../../../domain/bag/models'
import { useSession } from '../../auth/hooks/useSession'

export function useCreateBag() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewBagInput) => createBag(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags', user?.id] })
    },
  })
}

export function useUpdateBag(bagId: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: BagUpdateInput) => updateBag(bagId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bag', bagId] })
      queryClient.invalidateQueries({ queryKey: ['bags', user?.id] })
    },
  })
}

export function useSetActiveBag() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bagId: string) => setActiveBag(bagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags', user?.id] })
      // The DB trigger unsets is_active on every other bag the user owns,
      // so any open bag detail queries (not just the mutated one) need to
      // be invalidated too — 'bag' without an id matches all of them.
      queryClient.invalidateQueries({ queryKey: ['bag'] })
    },
  })
}

export function useDeleteBag() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bagId: string) => deleteBag(bagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags', user?.id] })
    },
  })
}

export function useAddDiscToBag(bagId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ discId, slot }: { discId: string; slot: BagSlot }) =>
      addDiscToBag(bagId, discId, slot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagDiscs', bagId] })
    },
  })
}

export function useUpdateBagDiscSlot(bagId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bagDiscId, slot }: { bagDiscId: string; slot: BagSlot }) =>
      updateBagDiscSlot(bagDiscId, slot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagDiscs', bagId] })
    },
  })
}

export function useRemoveDiscFromBag(bagId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bagDiscId: string) => removeDiscFromBag(bagDiscId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagDiscs', bagId] })
    },
  })
}
