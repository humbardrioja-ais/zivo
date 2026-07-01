import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/shared/error-state'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <ErrorState
          icon={FileQuestion}
          title="Page not found"
          description="The page you're looking for doesn't exist or has been moved."
          actions={
            <Button render={<Link href="/app" />}>Back to dashboard</Button>
          }
        />
      </div>
    </div>
  )
}
