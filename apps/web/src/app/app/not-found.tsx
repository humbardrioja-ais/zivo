import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/shared/page-layout'
import { ErrorState } from '@/components/shared/error-state'

export default function AppNotFound() {
  return (
    <PageLayout>
      <ErrorState
        icon={FileQuestion}
        title="Page not found"
        description="This page doesn't exist in your workspace."
        actions={
          <Button render={<Link href="/app" />}>Back to dashboard</Button>
        }
      />
    </PageLayout>
  )
}
