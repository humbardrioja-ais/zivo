'use client'

import { Popover as Base } from '@base-ui/react/popover'
import { cn } from '@/lib/utils'

export const Popover = Base.Root
export const PopoverTrigger = Base.Trigger

export function PopoverContent({
  children,
  className,
  sideOffset = 6,
  align = 'start',
}: {
  children: React.ReactNode
  className?: string
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <Base.Portal>
      <Base.Positioner sideOffset={sideOffset} align={align} className="z-50 outline-none">
        <Base.Popup
          className={cn(
            'rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none',
            'data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity',
            className,
          )}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  )
}
