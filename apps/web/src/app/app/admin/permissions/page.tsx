import { Lock } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'Permissions — Administration — Zivo OS' }

export default function PermissionsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Permissions"
        description="Configure granular access control policies across the platform."
      />
      <EmptyState
        icon={Lock}
        title="No data yet"
        description="Permission policies will be managed here."
      />
    </PageLayout>
  )
}
