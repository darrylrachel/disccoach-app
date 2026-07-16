import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addDisc,
  changeDiscStatus,
  deleteDisc,
  updateDisc,
  type DiscUpdateInput,
} from '../../../services/discs.service'
import type { DiscStatus, NewDiscInput } from '../../../domain/disc/models'
import { useSession } from '../../auth/hooks/useSession'

export function useAddDisc() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewDiscInput) => addDisc(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discs', user?.id] })
    },
  })
}

export function useUpdateDisc(discId: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: DiscUpdateInput) => updateDisc(discId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disc', discId] })
      queryClient.invalidateQueries({ queryKey: ['discs', user?.id] })
    },
  })
}

export function useChangeDiscStatus(discId: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: DiscStatus) => changeDiscStatus(discId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disc', discId] })
      queryClient.invalidateQueries({ queryKey: ['discs', user?.id] })
    },
  })
}

export function useDeleteDisc() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (discId: string) => deleteDisc(discId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discs', user?.id] })
    },
  })
}
