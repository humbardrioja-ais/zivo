import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  hint?: string
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' }
}

const trendColor = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-destructive',
  neutral: 'text-muted-foreground',
}

export function StatCard({ label, value, icon: Icon, hint, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          {trend && <span className={cn('text-xs font-medium', trendColor[trend.direction])}>{trend.value}</span>}
        </div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
