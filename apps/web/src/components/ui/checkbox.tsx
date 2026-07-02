'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

/**
 * Minimal, dependency-free checkbox styled to match the design system.
 * Wraps a native input for full keyboard and form semantics.
 */
export function Checkbox({
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled,
  id,
  className,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  return (
    <span className={cn('relative inline-flex h-4 w-4 shrink-0', className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate && !checked
        }}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded border border-input bg-transparent transition-colors checked:border-primary checked:bg-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Check className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
    </span>
  )
}
