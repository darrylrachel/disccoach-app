import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useDiscCatalogSearch } from '../hooks/useDiscCatalogSearch'
import { useAddDisc } from '../hooks/useDiscMutations'
import type { DiscCatalogEntry } from '../../../domain/disc/models'

type AddMode = 'catalog' | 'manual'

export function AddDiscScreen() {
  const [mode, setMode] = useState<AddMode>('catalog')
  const [selectedEntry, setSelectedEntry] = useState<DiscCatalogEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [nickname, setNickname] = useState('')
  const [customManufacturer, setCustomManufacturer] = useState('')
  const [customMoldName, setCustomMoldName] = useState('')

  const navigate = useNavigate()
  const addDisc = useAddDisc()
  const catalogSearch = useDiscCatalogSearch({ query: searchQuery })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const input =
      mode === 'catalog' && selectedEntry
        ? { catalogId: selectedEntry.id, nickname: nickname || null }
        : { customManufacturer, customMoldName, nickname: nickname || null }

    addDisc.mutate(input, {
      onSuccess: (disc) => navigate(`/discs/${disc.id}`, { replace: true }),
    })
  }

  const canSubmit =
    mode === 'catalog'
      ? !!selectedEntry
      : customManufacturer.trim() !== '' && customMoldName.trim() !== ''

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-white">Add a disc</h1>

      <div className="mb-6 flex gap-2 rounded-lg border border-white/10 p-1">
        <button
          type="button"
          onClick={() => setMode('catalog')}
          className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
            mode === 'catalog' ? 'bg-brand-green text-black' : 'text-white/60'
          }`}
        >
          From catalog
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
            mode === 'manual' ? 'bg-brand-green text-black' : 'text-white/60'
          }`}
        >
          Add manually
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === 'catalog' ? (
          <>
            <Input
              id="catalogSearch"
              label="Search the catalog"
              placeholder="Manufacturer or mold name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSelectedEntry(null)
              }}
            />

            {catalogSearch.isLoading && <p className="text-sm text-white/50">Searching…</p>}

            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
              {catalogSearch.data?.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntry(entry)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selectedEntry?.id === entry.id
                      ? 'border-brand-green bg-brand-green/10 text-white'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <span className="font-semibold">
                    {entry.manufacturer} {entry.moldName}
                  </span>
                  <span className="ml-2 text-white/40">
                    {entry.speed}/{entry.glide}/{entry.turn}/{entry.fade}
                  </span>
                </button>
              ))}
              {catalogSearch.data?.length === 0 && !catalogSearch.isLoading && (
                <p className="text-sm text-white/50">No matches.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <Input
              id="customManufacturer"
              label="Manufacturer"
              required
              value={customManufacturer}
              onChange={(e) => setCustomManufacturer(e.target.value)}
            />
            <Input
              id="customMoldName"
              label="Mold name"
              required
              value={customMoldName}
              onChange={(e) => setCustomMoldName(e.target.value)}
            />
          </>
        )}

        <Input
          id="nickname"
          label="Nickname (optional)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        {addDisc.isError && <p className="text-sm text-red-400">Unable to add this disc.</p>}

        <Button type="submit" disabled={!canSubmit || addDisc.isPending}>
          {addDisc.isPending ? 'Adding…' : 'Add disc'}
        </Button>
      </form>
    </div>
  )
}
