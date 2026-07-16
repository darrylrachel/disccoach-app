import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { FlightNumberBadges } from '../../../components/disc/FlightNumberBadges'
import { resolveEffectiveFlightNumbers } from '../../../domain/disc/flightNumbers'
import { defaultSlotForDisc, type BagSlot } from '../../../domain/bag/models'
import { useDiscs } from '../../discs/hooks/useDiscs'
import { useBag } from '../hooks/useBag'
import { useBagAnalysis } from '../hooks/useBagAnalysis'
import {
  useAddDiscToBag,
  useDeleteBag,
  useRemoveDiscFromBag,
  useSetActiveBag,
  useUpdateBag,
  useUpdateBagDiscSlot,
} from '../hooks/useBagMutations'
import { BagDashboard } from '../components/BagDashboard'
import { SLOT_LABELS, SLOT_ORDER } from '../slotLabels'
import type { BagDiscWithDisc } from '../../../services/bags.service'

function discLabel({ disc, catalogEntry }: BagDiscWithDisc['discWithCatalog']): string {
  return disc.nickname || catalogEntry?.moldName || disc.customMoldName || 'Unnamed disc'
}

export function BagDetailScreen() {
  const { bagId } = useParams<{ bagId: string }>()
  const navigate = useNavigate()
  const { data: bag, isLoading: bagLoading, isError: bagError } = useBag(bagId)
  const { data: bagDiscs, analysis, isLoading: discsLoading } = useBagAnalysis(bagId)

  if (bagLoading || discsLoading) {
    return <div className="px-6 py-8 text-white/50">Loading bag…</div>
  }
  if (bagError || !bag || !bagId) {
    return <div className="px-6 py-8 text-red-400">Bag not found.</div>
  }

  return (
    <BagDetailContent
      key={bagId}
      bagId={bagId}
      bag={bag}
      bagDiscs={bagDiscs ?? []}
      analysis={analysis}
      onDeleted={() => navigate('/bags', { replace: true })}
    />
  )
}

interface BagDetailContentProps {
  bagId: string
  bag: { name: string; description: string | null; isActive: boolean }
  bagDiscs: BagDiscWithDisc[]
  analysis: ReturnType<typeof useBagAnalysis>['analysis']
  onDeleted: () => void
}

function BagDetailContent({ bagId, bag, bagDiscs, analysis, onDeleted }: BagDetailContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(bag.name)
  const [description, setDescription] = useState(bag.description ?? '')

  const updateBag = useUpdateBag(bagId)
  const setActiveBag = useSetActiveBag()
  const deleteBag = useDeleteBag()
  const addDiscToBag = useAddDiscToBag(bagId)
  const removeDiscFromBag = useRemoveDiscFromBag(bagId)
  const updateBagDiscSlot = useUpdateBagDiscSlot(bagId)

  const { data: activeDiscs } = useDiscs({ status: 'active' })
  const [selectedDiscId, setSelectedDiscId] = useState('')

  const discsInBag = useMemo(() => new Set(bagDiscs.map((d) => d.discWithCatalog.disc.id)), [bagDiscs])
  const availableDiscs = useMemo(
    () => (activeDiscs ?? []).filter((d) => !discsInBag.has(d.disc.id)),
    [activeDiscs, discsInBag],
  )

  const discsBySlot = useMemo(() => {
    const groups = new Map<BagSlot, BagDiscWithDisc[]>()
    for (const bd of bagDiscs) {
      const list = groups.get(bd.bagDisc.slot) ?? []
      list.push(bd)
      groups.set(bd.bagDisc.slot, list)
    }
    return groups
  }, [bagDiscs])

  function handleSaveDetails(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    updateBag.mutate(
      { name: name.trim(), description: description.trim() || null },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  function handleDeleteBag() {
    if (!confirm(`Delete "${bag.name}"? This cannot be undone.`)) return
    deleteBag.mutate(bagId, { onSuccess: onDeleted })
  }

  function handleAddDisc(event: FormEvent) {
    event.preventDefault()
    const entry = availableDiscs.find((d) => d.disc.id === selectedDiscId)
    if (!entry) return

    const numbers = resolveEffectiveFlightNumbers(entry.disc, entry.catalogEntry)
    const slot = entry.catalogEntry
      ? defaultSlotForDisc(entry.catalogEntry.category, numbers.speed)
      : 'midrange'

    addDiscToBag.mutate(
      { discId: entry.disc.id, slot },
      { onSuccess: () => setSelectedDiscId('') },
    )
  }

  return (
    <div className="px-6 py-8 pb-24">
      {isEditing ? (
        <form onSubmit={handleSaveDetails} className="mb-6 flex flex-col gap-3">
          <Input id="bagName" label="Bag name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            id="bagDescription"
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={!name.trim() || updateBag.isPending}>
              {updateBag.isPending ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-white">{bag.name}</h1>
            {bag.description && <p className="truncate text-sm text-white/50">{bag.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/70 transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
          >
            Rename
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {bag.isActive ? (
          <span className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green">
            Default bag
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setActiveBag.mutate(bagId)}
            disabled={setActiveBag.isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green disabled:opacity-50"
          >
            Set as default
          </button>
        )}
        <button
          type="button"
          onClick={handleDeleteBag}
          disabled={deleteBag.isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400 transition-colors hover:border-red-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
        >
          Delete bag
        </button>
      </div>

      {analysis && (
        <div className="mb-8">
          <BagDashboard analysis={analysis} />
        </div>
      )}

      <div className="mb-6">
        <p className="mb-3 text-xs uppercase tracking-wide text-white/55">Add a disc</p>
        <form onSubmit={handleAddDisc} className="flex flex-col gap-3">
          <Select
            id="addDiscSelect"
            label="Disc"
            value={selectedDiscId}
            onChange={(e) => setSelectedDiscId(e.target.value)}
          >
            <option value="">
              {availableDiscs.length === 0 ? 'No available discs' : 'Choose a disc…'}
            </option>
            {availableDiscs.map((d) => (
              <option key={d.disc.id} value={d.disc.id}>
                {discLabel(d)}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={!selectedDiscId || addDiscToBag.isPending}>
            {addDiscToBag.isPending ? 'Adding…' : 'Add to bag'}
          </Button>
        </form>
        {addDiscToBag.isError && <p className="mt-2 text-sm text-red-400">Unable to add that disc.</p>}
      </div>

      <p className="mb-3 text-xs uppercase tracking-wide text-white/55">Bag contents</p>
      {bagDiscs.length === 0 && <p className="text-white/50">No discs in this bag yet.</p>}

      <div className="flex flex-col gap-6">
        {SLOT_ORDER.filter((slot) => discsBySlot.has(slot)).map((slot) => (
          <div key={slot}>
            <p className="mb-2 text-sm font-semibold text-white/70">{SLOT_LABELS[slot]}</p>
            <div className="flex flex-col gap-2">
              {discsBySlot.get(slot)!.map((bd) => {
                const numbers = resolveEffectiveFlightNumbers(
                  bd.discWithCatalog.disc,
                  bd.discWithCatalog.catalogEntry,
                )
                return (
                  <div
                    key={bd.bagDisc.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {discLabel(bd.discWithCatalog)}
                      </p>
                    </div>
                    <FlightNumberBadges numbers={numbers} />
                    <select
                      value={bd.bagDisc.slot}
                      onChange={(e) =>
                        updateBagDiscSlot.mutate({
                          bagDiscId: bd.bagDisc.id,
                          slot: e.target.value as BagSlot,
                        })
                      }
                      aria-label="Flight slot"
                      className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green"
                    >
                      {SLOT_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {SLOT_LABELS[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeDiscFromBag.mutate(bd.bagDisc.id)}
                      disabled={removeDiscFromBag.isPending}
                      className="shrink-0 text-xs text-red-400 transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
