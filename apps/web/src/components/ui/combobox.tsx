'use client'

import { Combobox as Base } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboboxItem {
  value: string
  label: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  loading?: boolean
  id?: string
  className?: string
}

/**
 * Zivo standard searchable selector. Wraps base-ui Combobox with the Design
 * System styling. Items are `{ value, label }`; selection is controlled by the
 * string `value`. Provides search, keyboard nav, empty/loading states, and
 * clear — reuse everywhere a searchable single-select is needed.
 */
export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = 'Select...',
  emptyText = 'No results found.',
  disabled,
  loading,
  id,
  className,
}: ComboboxProps) {
  const selected = items.find((i) => i.value === value) ?? null

  return (
    <Base.Root
      items={items}
      value={selected}
      onValueChange={(item: ComboboxItem | null) => onValueChange(item?.value ?? null)}
      disabled={disabled}
    >
      <Base.InputGroup
        className={cn(
          'relative flex h-8 w-full items-center rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:cursor-not-allowed has-disabled:opacity-50 dark:bg-input/30',
          className,
        )}
      >
        <Base.Input
          id={id}
          placeholder={placeholder}
          className="h-full w-full rounded-lg border-0 bg-transparent pl-2.5 pr-14 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="absolute right-1 flex h-full items-center">
          {loading && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          {value && !loading && (
            <Base.Clear
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </Base.Clear>
          )}
          <Base.Trigger
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Open"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
          </Base.Trigger>
        </div>
      </Base.InputGroup>

      <Base.Portal>
        <Base.Positioner sideOffset={4} className="z-50 outline-none">
          <Base.Popup className="max-h-64 w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
            <Base.Empty className="px-2 py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </Base.Empty>
            <Base.List>
              {(item: ComboboxItem) => (
                <Base.Item
                  key={item.value}
                  value={item}
                  className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    <Base.ItemIndicator><Check className="h-4 w-4" /></Base.ItemIndicator>
                  </span>
                  <span className="truncate">{item.label}</span>
                </Base.Item>
              )}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
