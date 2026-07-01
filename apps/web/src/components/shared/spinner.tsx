import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  size?: number
}

export function Spinner({ className, size = 16 }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin text-muted-foreground', className)} style={{ width: size, height: size }} />
}

export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-2">
        <Spinner size={20} />
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}
