import type { LucideIcon } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actions?: React.ReactNode
}

export function ErrorState({ icon: Icon = AlertTriangle, title, description, actions }: ErrorStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-12">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <Icon className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        {actions && <div className="mt-4">{actions}</div>}
      </div>
    </div>
  )
}
