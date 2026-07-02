import { cn } from '@/lib/utils'
import { STATUS_LABELS, type WorkItemStatus } from '@/lib/workflow/types'

const styles: Record<WorkItemStatus, string> = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  blocked: 'bg-destructive/10 text-destructive',
  in_review: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  done: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  cancelled: 'bg-muted text-muted-foreground line-through',
}

/**
 * Badge for workflow (task) statuses — todo, in_progress, blocked, in_review,
 * done, cancelled. Shared across Tasks and any future work-item surface.
 */
export function WorkStatusBadge({ status }: { status: string }) {
  const key = (status in STATUS_LABELS ? status : 'todo') as WorkItemStatus
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles[key])}>
      {STATUS_LABELS[key]}
    </span>
  )
}
