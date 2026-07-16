import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useBags } from '../hooks/useBags'
import { useCreateBag, useSetActiveBag } from '../hooks/useBagMutations'

export function BagListScreen() {
  const { data: bags, isLoading, isError } = useBags()
  const createBag = useCreateBag()
  const setActiveBag = useSetActiveBag()

  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  function handleCreate(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    createBag.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName('')
          setIsCreating(false)
        },
      },
    )
  }

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Bags</h1>
        <button
          type="button"
          onClick={() => setIsCreating((v) => !v)}
          className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-green/90"
        >
          {isCreating ? 'Cancel' : 'New bag'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3">
          <Input
            id="bagName"
            label="Bag name"
            placeholder="e.g. Tournament Bag"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {createBag.isError && <p className="text-sm text-red-400">Unable to create this bag.</p>}
          <Button type="submit" disabled={!name.trim() || createBag.isPending}>
            {createBag.isPending ? 'Creating…' : 'Create bag'}
          </Button>
        </form>
      )}

      {isLoading && <p className="text-white/50">Loading your bags…</p>}
      {isError && <p className="text-red-400">Unable to load your bags.</p>}

      {!isLoading && !isError && bags?.length === 0 && (
        <p className="text-white/50">
          You haven't created a bag yet. Start with a Tournament Bag or Practice Bag.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {bags?.map((bag) => (
          <div
            key={bag.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <Link to={`/bags/${bag.id}`} className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{bag.name}</p>
              {bag.description && (
                <p className="truncate text-xs text-white/50">{bag.description}</p>
              )}
            </Link>
            {bag.isActive ? (
              <span className="shrink-0 rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green">
                Default
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setActiveBag.mutate(bag.id)}
                disabled={setActiveBag.isPending}
                className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 transition-colors hover:border-white/40 disabled:opacity-50"
              >
                Set default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
