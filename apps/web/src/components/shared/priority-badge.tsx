import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  urgent: 'bg-destructive/10 text-destructive',
  high: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  medium: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  low: 'bg-muted text-muted-foreground',
}

interface PriorityBadgeProps {
  priority: string
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize', styles[priority] ?? styles.low)}>
      {priority}
    </span>
  )
}
