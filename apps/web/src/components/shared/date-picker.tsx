'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  /** ISO date string (yyyy-MM-dd) or empty. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: (date: Date) => boolean
  id?: string
  className?: string
}

/**
 * Zivo standard date field. Button + popover calendar. Emits an ISO
 * `yyyy-MM-dd` string (or '' when cleared) so it drops into any form/action.
 * Locale-aware display, min/max and custom disabled-date support, dark mode.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  minDate,
  maxDate,
  disabledDates,
  id,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined

  const disabledMatcher = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
    ...(disabledDates ? [disabledDates] : []),
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
          !value && 'text-muted-foreground',
          className,
        )}
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">{selected ? format(selected, 'PP') : placeholder}</span>
        {value && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Clear date"
            className="text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onChange('') }}
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            onChange(d ? format(d, 'yyyy-MM-dd') : '')
            setOpen(false)
          }}
          disabled={disabledMatcher.length > 0 ? disabledMatcher : undefined}
          startMonth={minDate}
          endMonth={maxDate}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
