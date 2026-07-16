import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '../../../services/profile.service'
import type { PlayerProfile } from '../../../domain/profile/models'
import { useSession } from '../../auth/hooks/useSession'

export function useProfile() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  })
}

export function useUpdateProfile() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<Omit<PlayerProfile, 'id'>>) =>
      updateProfile(user!.id, updates),
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile', user?.id], profile)
    },
  })
}
