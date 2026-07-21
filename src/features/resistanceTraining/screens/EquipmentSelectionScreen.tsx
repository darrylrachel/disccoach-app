import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { EquipmentPicker } from '../components/EquipmentPicker'
import { useEquipment, useSetUserEquipment, useUserEquipment } from '../hooks/useEquipment'
import { useProgram } from '../../programs/hooks/usePrograms'
import { useEnrollInProgram } from '../../programs/hooks/useProgramMutations'

export function EquipmentSelectionScreen() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()

  const { data: program } = useProgram(programId)
  const { data: equipment, isLoading: equipmentLoading } = useEquipment()
  const { data: userEquipmentIds, isLoading: userEquipmentLoading } = useUserEquipment()
  const setUserEquipment = useSetUserEquipment()
  const enrollInProgram = useEnrollInProgram()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && userEquipmentIds) {
      setSelectedIds(userEquipmentIds)
      setInitialized(true)
    }
  }, [initialized, userEquipmentIds])

  if (equipmentLoading || userEquipmentLoading || !equipment) {
    return <div className="px-6 py-8 text-white/50">Loading equipment…</div>
  }

  const isPending = setUserEquipment.isPending || enrollInProgram.isPending

  function handleContinue() {
    if (!programId) return
    setUserEquipment.mutate(Array.from(selectedIds), {
      onSuccess: () => {
        enrollInProgram.mutate(programId, { onSuccess: () => navigate('/programs/active') })
      },
    })
  }

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-1 text-2xl font-bold text-white">What equipment do you have?</h1>
      <p className="mb-6 text-sm text-white/50">
        {program ? `${program.name} adapts to what you've got — select everything available to you.` : ''} You can
        change this anytime from Account.
      </p>

      <EquipmentPicker equipment={equipment} selectedIds={selectedIds} onChange={setSelectedIds} />

      {(setUserEquipment.isError || enrollInProgram.isError) && (
        <p className="mt-4 text-sm text-red-400">Unable to save your equipment. Try again.</p>
      )}

      <div className="mt-8">
        <Button onClick={handleContinue} disabled={isPending}>
          {isPending ? 'Starting…' : 'Start program'}
        </Button>
      </div>
    </div>
  )
}
