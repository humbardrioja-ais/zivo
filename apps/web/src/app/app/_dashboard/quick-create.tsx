'use client'

import { FolderKanban, CheckSquare, Video, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const actions = [
  { label: 'Project', icon: FolderKanban },
  { label: 'Task', icon: CheckSquare },
  { label: 'Meeting', icon: Video },
  { label: 'Event', icon: Calendar },
  { label: 'Note', icon: FileText },
]

/**
 * Quick Create — the single entry point for starting new work from Home.
 * Buttons are disabled placeholders until their owning modules ship; the
 * layout and affordance are final so wiring each up is a one-line change.
 */
export function QuickCreate() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4 text-muted-foreground" />
          Quick Create
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" disabled>
              <a.icon className="mr-1.5 h-4 w-4" />
              {a.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
