import { useState } from 'react'
import { Input } from '../../../components/ui/Input'
import { useDiscCatalogSearch } from '../hooks/useDiscCatalogSearch'
import type { DiscCatalogEntry } from '../../../domain/disc/models'

export type DiscIdentityValue =
  | { mode: 'catalog'; catalogEntry: DiscCatalogEntry | null }
  | { mode: 'manual'; customManufacturer: string; customMoldName: string }

export function isDiscIdentityComplete(value: DiscIdentityValue): boolean {
  return value.mode === 'catalog'
    ? value.catalogEntry !== null
    : value.customManufacturer.trim() !== '' && value.customMoldName.trim() !== ''
}

interface DiscIdentityPickerProps {
  value: DiscIdentityValue
  onChange: (value: DiscIdentityValue) => void
}

export function DiscIdentityPicker({ value, onChange }: DiscIdentityPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const catalogSearch = useDiscCatalogSearch({ query: searchQuery })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-lg border border-white/10 p-1">
        <button
          type="button"
          onClick={() => onChange({ mode: 'catalog', catalogEntry: null })}
          className={`flex min-h-11 flex-1 items-center justify-center rounded-md py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
            value.mode === 'catalog' ? 'bg-brand-green text-black' : 'text-white/60'
          }`}
        >
          From catalog
        </button>
        <button
          type="button"
          onClick={() => onChange({ mode: 'manual', customManufacturer: '', customMoldName: '' })}
          className={`flex min-h-11 flex-1 items-center justify-center rounded-md py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
            value.mode === 'manual' ? 'bg-brand-green text-black' : 'text-white/60'
          }`}
        >
          Add manually
        </button>
      </div>

      {value.mode === 'catalog' ? (
        <>
          <Input
            id="catalogSearch"
            label="Search the catalog"
            placeholder="Manufacturer or mold name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              onChange({ mode: 'catalog', catalogEntry: null })
            }}
          />

          {value.catalogEntry && (
            <p className="text-sm text-white/70">
              Selected: <span className="text-white">{value.catalogEntry.manufacturer} {value.catalogEntry.moldName}</span>
            </p>
          )}

          {catalogSearch.isLoading && <p className="text-sm text-white/50">Searching…</p>}

          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            {catalogSearch.data?.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onChange({ mode: 'catalog', catalogEntry: entry })}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  value.catalogEntry?.id === entry.id
                    ? 'border-brand-green bg-brand-green/10 text-white'
                    : 'border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <span className="font-semibold">
                  {entry.manufacturer} {entry.moldName}
                </span>
                <span className="ml-2 text-white/55">
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
            value={value.customManufacturer}
            onChange={(e) => onChange({ ...value, customManufacturer: e.target.value })}
          />
          <Input
            id="customMoldName"
            label="Mold name"
            required
            value={value.customMoldName}
            onChange={(e) => onChange({ ...value, customMoldName: e.target.value })}
          />
        </>
      )}
    </div>
  )
}
