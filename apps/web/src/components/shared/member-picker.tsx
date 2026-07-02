'use client'

import { Combobox as Base } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown, X, Loader2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrgMemberOption } from '@/lib/workflow/members'

interface MemberPickerProps {
  members: OrgMemberOption[]
  value: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  id?: string
  className?: string
}

/**
 * The Zivo standard for picking a person. Searchable, shows avatar initials,
 * name, job title, and department. Controlled by the member id.
 *
 * Reuse for: project lead, task assignee, meeting participants, approvers,
 * CRM owners, HR managers. For multi-select, extend with base-ui `multiple`.
 */
export function MemberPicker({
  members,
  value,
  onValueChange,
  placeholder = 'Select a member...',
  disabled,
  loading,
  id,
  className,
}: MemberPickerProps) {
  // base-ui filters {value,label} automatically; give each member a label.
  const items = members.map((m) => ({ ...m, value: m.id, label: m.displayName }))
  const selected = items.find((i) => i.value === value) ?? null

  return (
    <Base.Root
      items={items}
      value={selected}
      onValueChange={(item: (typeof items)[number] | null) => onValueChange(item?.value ?? null)}
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
            <Base.Clear className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground" aria-label="Clear selection">
              <X className="h-3.5 w-3.5" />
            </Base.Clear>
          )}
          <Base.Trigger className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground" aria-label="Open">
            <ChevronsUpDown className="h-3.5 w-3.5" />
          </Base.Trigger>
        </div>
      </Base.InputGroup>

      <Base.Portal>
        <Base.Positioner sideOffset={4} className="z-50 outline-none">
          <Base.Popup className="max-h-72 w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
            <Base.Empty className="flex flex-col items-center gap-1 px-2 py-6 text-center text-sm text-muted-foreground">
              <Users className="h-5 w-5" />
              No members found.
            </Base.Empty>
            <Base.List>
              {(item: (typeof items)[number]) => (
                <Base.Item
                  key={item.value}
                  value={item}
                  className="flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {item.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.displayName}</span>
                    {(item.jobTitle || item.department) && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {[item.jobTitle, item.department].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </span>
                  <span className="flex h-4 w-4 items-center justify-center">
                    <Base.ItemIndicator><Check className="h-4 w-4" /></Base.ItemIndicator>
                  </span>
                </Base.Item>
              )}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
