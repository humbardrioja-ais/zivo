'use client'

import { ServerCrash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/shared/error-state'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <ErrorState
          icon={ServerCrash}
          title="Something went wrong"
          description="An unexpected error occurred. Please try again."
          actions={<Button onClick={reset}>Try again</Button>}
        />
      </div>
    </div>
  )
}
