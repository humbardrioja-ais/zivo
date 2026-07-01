'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DataToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  actions?: React.ReactNode
}

export function DataToolbar({ search, onSearchChange, placeholder = 'Search...', actions }: DataToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9"
        />
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
