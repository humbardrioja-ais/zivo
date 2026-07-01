import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { dueLabel } from '@/lib/workflow/format'
import { STATUS_LABELS, type WorkItem } from '@/lib/workflow/types'

export function WorkItemRow({ item }: { item: WorkItem }) {
  return (
    <Link
      href={item.href}
      className="flex items-center justify-between gap-3 rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-accent"
    >
      <div className="flex min-w-0 items-center gap-2">
        <PriorityBadge priority={item.priority} />
        <span className="truncate text-sm">{item.title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {item.dueAt && (
          <span className="text-xs text-muted-foreground">{dueLabel(item.dueAt)}</span>
        )}
        <Badge variant="secondary" className="text-xs font-normal">
          {STATUS_LABELS[item.status]}
        </Badge>
      </div>
    </Link>
  )
}
