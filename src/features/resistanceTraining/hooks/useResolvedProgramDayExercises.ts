import { useQuery } from '@tanstack/react-query'
import { getResolvedProgramDayExercises } from '../../../services/resistanceTraining.service'
import { useUserEquipment } from './useEquipment'

export function useResolvedProgramDayExercises(programDayId: string | undefined) {
  const { data: equipmentIds, isLoading: equipmentLoading } = useUserEquipment()

  const query = useQuery({
    queryKey: ['resolvedProgramDayExercises', programDayId, equipmentIds ? Array.from(equipmentIds).sort() : null],
    queryFn: () => getResolvedProgramDayExercises(programDayId!, equipmentIds!),
    enabled: !!programDayId && !!equipmentIds,
  })

  return { ...query, isLoading: query.isLoading || equipmentLoading }
}
