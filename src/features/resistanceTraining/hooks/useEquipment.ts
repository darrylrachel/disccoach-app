import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserEquipmentIds, listEquipment, setUserEquipment } from '../../../services/resistanceTraining.service'
import { useSession } from '../../auth/hooks/useSession'

export function useEquipment() {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: listEquipment,
  })
}

export function useUserEquipment() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['userEquipment', user?.id],
    queryFn: () => getUserEquipmentIds(user!.id),
    enabled: !!user,
  })
}

export function useSetUserEquipment() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (equipmentIds: string[]) => setUserEquipment(user!.id, equipmentIds),
    onSuccess: (_data, equipmentIds) => {
      queryClient.setQueryData(['userEquipment', user?.id], new Set(equipmentIds))
    },
  })
}
