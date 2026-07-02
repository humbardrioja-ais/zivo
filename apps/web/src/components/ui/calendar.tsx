'use client'

import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/**
 * Styled react-day-picker calendar. Locale-aware, keyboard accessible, dark
 * mode ready. Base styles come from react-day-picker/style.css (imported in
 * globals.css); these classNames layer the Design System palette on top.
 */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-2', className)}
      classNames={{
        months: 'flex flex-col',
        month: 'space-y-2',
        month_caption: 'flex h-8 items-center justify-center px-8 relative',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between px-1',
        button_previous: 'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground',
        button_next: 'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-8 text-xs font-normal text-muted-foreground',
        week: 'flex w-full mt-1',
        day: 'h-8 w-8 p-0 text-center text-sm',
        day_button: 'inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent aria-selected:opacity-100',
        selected: '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
        today: '[&>button]:font-semibold [&>button]:text-primary',
        outside: 'text-muted-foreground/40',
        disabled: 'text-muted-foreground/30 [&>button]:pointer-events-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
