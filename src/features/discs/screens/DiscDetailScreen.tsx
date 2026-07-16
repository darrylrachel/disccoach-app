import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { useDisc } from '../hooks/useDisc'
import { useChangeDiscStatus, useDeleteDisc, useUpdateDisc } from '../hooks/useDiscMutations'
import type { DiscCondition, DiscStatus, DiscWithCatalog } from '../../../domain/disc/models'

const CONDITION_OPTIONS: DiscCondition[] = ['new', 'good', 'worn', 'beat_in', 'retired_worthy']

export function DiscDetailScreen() {
  const { discId } = useParams<{ discId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useDisc(discId)

  if (isLoading) return <div className="px-6 py-8 text-white/50">Loading disc…</div>
  if (isError || !data || !discId) {
    return <div className="px-6 py-8 text-red-400">Disc not found.</div>
  }

  return (
    <DiscDetailForm
      key={discId}
      discId={discId}
      initial={data}
      onDeleted={() => navigate('/discs', { replace: true })}
    />
  )
}

interface DiscDetailFormProps {
  discId: string
  initial: DiscWithCatalog
  onDeleted: () => void
}

function DiscDetailForm({ discId, initial, onDeleted }: DiscDetailFormProps) {
  const { disc, catalogEntry } = initial

  const [personalSpeed, setPersonalSpeed] = useState(disc.personalSpeed?.toString() ?? '')
  const [personalGlide, setPersonalGlide] = useState(disc.personalGlide?.toString() ?? '')
  const [personalTurn, setPersonalTurn] = useState(disc.personalTurn?.toString() ?? '')
  const [personalFade, setPersonalFade] = useState(disc.personalFade?.toString() ?? '')
  const [condition, setCondition] = useState<DiscCondition>(disc.condition)
  const [beatInLevel, setBeatInLevel] = useState(disc.beatInLevel.toString())
  const [confidenceRating, setConfidenceRating] = useState(disc.confidenceRating?.toString() ?? '')
  const [notes, setNotes] = useState(disc.notes ?? '')
  const [favoriteUses, setFavoriteUses] = useState((disc.favoriteUses ?? []).join(', '))

  const updateDisc = useUpdateDisc(discId)
  const changeStatus = useChangeDiscStatus(discId)
  const deleteDisc = useDeleteDisc()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updateDisc.mutate({
      personalSpeed: personalSpeed ? Number(personalSpeed) : null,
      personalGlide: personalGlide ? Number(personalGlide) : null,
      personalTurn: personalTurn ? Number(personalTurn) : null,
      personalFade: personalFade ? Number(personalFade) : null,
      condition,
      beatInLevel: Number(beatInLevel),
      confidenceRating: confidenceRating ? Number(confidenceRating) : null,
      notes: notes || null,
      favoriteUses: favoriteUses
        ? favoriteUses
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
    })
  }

  function handleDelete() {
    if (!confirm('Permanently delete this disc? This cannot be undone.')) return
    deleteDisc.mutate(discId, { onSuccess: onDeleted })
  }

  const title = disc.nickname || catalogEntry?.moldName || disc.customMoldName || 'Unnamed disc'
  const subtitle = catalogEntry
    ? `${catalogEntry.manufacturer} ${catalogEntry.moldName}`
    : `${disc.customManufacturer} ${disc.customMoldName}`

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mb-6 text-sm text-white/50">{subtitle}</p>

      {catalogEntry && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-white/55">Catalog numbers</p>
          <div className="flex gap-4 text-sm text-white">
            <span>Speed {catalogEntry.speed}</span>
            <span>Glide {catalogEntry.glide}</span>
            <span>Turn {catalogEntry.turn}</span>
            <span>Fade {catalogEntry.fade}</span>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className="text-xs uppercase tracking-wide text-white/55">
          Personal numbers (optional — overrides catalog)
        </p>
        <div className="grid grid-cols-4 gap-2">
          <Input
            id="personalSpeed"
            label="Speed"
            type="number"
            step="0.5"
            value={personalSpeed}
            onChange={(e) => setPersonalSpeed(e.target.value)}
          />
          <Input
            id="personalGlide"
            label="Glide"
            type="number"
            step="0.5"
            value={personalGlide}
            onChange={(e) => setPersonalGlide(e.target.value)}
          />
          <Input
            id="personalTurn"
            label="Turn"
            type="number"
            step="0.5"
            value={personalTurn}
            onChange={(e) => setPersonalTurn(e.target.value)}
          />
          <Input
            id="personalFade"
            label="Fade"
            type="number"
            step="0.5"
            value={personalFade}
            onChange={(e) => setPersonalFade(e.target.value)}
          />
        </div>

        <Select
          id="condition"
          label="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value as DiscCondition)}
        >
          {CONDITION_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c.replace('_', ' ')}
            </option>
          ))}
        </Select>

        <Input
          id="beatInLevel"
          label="Beat-in level (0-10)"
          type="number"
          min={0}
          max={10}
          value={beatInLevel}
          onChange={(e) => setBeatInLevel(e.target.value)}
        />
        <Input
          id="confidenceRating"
          label="Confidence rating (1-5)"
          type="number"
          min={1}
          max={5}
          value={confidenceRating}
          onChange={(e) => setConfidenceRating(e.target.value)}
        />
        <Input
          id="favoriteUses"
          label="Favorite uses (comma-separated)"
          placeholder="e.g. forehand roller, hyzer flip"
          value={favoriteUses}
          onChange={(e) => setFavoriteUses(e.target.value)}
        />
        <Input id="notes" label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {updateDisc.isError && <p className="text-sm text-red-400">Unable to save changes.</p>}

        <Button type="submit" disabled={updateDisc.isPending}>
          {updateDisc.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="mb-3 text-xs uppercase tracking-wide text-white/55">Lifecycle</p>
        <div className="flex flex-wrap gap-2">
          {(['active', 'retired', 'lost', 'traded'] as DiscStatus[])
            .filter((s) => s !== disc.status)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => changeStatus.mutate(s)}
                disabled={changeStatus.isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green disabled:opacity-50"
              >
                Mark {s}
              </button>
            ))}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteDisc.isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-400 transition-colors hover:border-red-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
          >
            Delete disc
          </button>
        </div>
      </div>
    </div>
  )
}
