import { cn } from '@/lib/utils'

interface ContentContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide' | 'full'
}

const sizes = {
  narrow: 'max-w-2xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
}

export function ContentContainer({ children, className, size = 'default' }: ContentContainerProps) {
  return <div className={cn('mx-auto w-full', sizes[size], className)}>{children}</div>
}
