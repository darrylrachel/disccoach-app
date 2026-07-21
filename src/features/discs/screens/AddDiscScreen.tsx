import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { DiscIdentityPicker, isDiscIdentityComplete, type DiscIdentityValue } from '../components/DiscIdentityPicker'
import { useDisc } from '../hooks/useDisc'
import { useAddDisc } from '../hooks/useDiscMutations'

export function AddDiscScreen() {
  const [searchParams] = useSearchParams()
  const duplicateFromId = searchParams.get('duplicateFrom') ?? undefined
  const { data: duplicateSource, isLoading: duplicateLoading } = useDisc(duplicateFromId)

  if (duplicateFromId && duplicateLoading) {
    return <div className="px-6 py-8 text-white/50">Loading disc…</div>
  }

  return <AddDiscForm duplicateSource={duplicateSource ?? null} />
}

interface AddDiscFormProps {
  duplicateSource: ReturnType<typeof useDisc>['data'] | null
}

function AddDiscForm({ duplicateSource }: AddDiscFormProps) {
  const [identity, setIdentity] = useState<DiscIdentityValue>(() => {
    if (duplicateSource?.catalogEntry) {
      return { mode: 'catalog', catalogEntry: duplicateSource.catalogEntry }
    }
    if (duplicateSource?.disc.customManufacturer && duplicateSource.disc.customMoldName) {
      return {
        mode: 'manual',
        customManufacturer: duplicateSource.disc.customManufacturer,
        customMoldName: duplicateSource.disc.customMoldName,
      }
    }
    return { mode: 'catalog', catalogEntry: null }
  })
  const [nickname, setNickname] = useState('')
  const [plastic, setPlastic] = useState(duplicateSource?.disc.plastic ?? '')

  const navigate = useNavigate()
  const addDisc = useAddDisc()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const input =
      identity.mode === 'catalog' && identity.catalogEntry
        ? { catalogId: identity.catalogEntry.id, nickname: nickname || null, plastic: plastic || null }
        : identity.mode === 'manual'
          ? {
              customManufacturer: identity.customManufacturer,
              customMoldName: identity.customMoldName,
              nickname: nickname || null,
              plastic: plastic || null,
            }
          : null

    if (!input) return

    addDisc.mutate(input, {
      onSuccess: (disc) => navigate(`/discs/${disc.id}`, { replace: true }),
    })
  }

  const canSubmit = isDiscIdentityComplete(identity)

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-1 text-2xl font-bold text-white">{duplicateSource ? 'Add another copy' : 'Add a disc'}</h1>
      {duplicateSource && (
        <p className="mb-6 text-sm text-white/50">
          Adding a new physical disc of the same mold — give it its own weight, color, and condition below.
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <DiscIdentityPicker value={identity} onChange={setIdentity} />

        <Input
          id="nickname"
          label="Nickname (optional)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Input
          id="plastic"
          label="Plastic (optional)"
          value={plastic}
          onChange={(e) => setPlastic(e.target.value)}
        />

        {addDisc.isError && <p className="text-sm text-red-400">Unable to add this disc.</p>}

        <Button type="submit" disabled={!canSubmit || addDisc.isPending}>
          {addDisc.isPending ? 'Adding…' : 'Add disc'}
        </Button>
      </form>
    </div>
  )
}
