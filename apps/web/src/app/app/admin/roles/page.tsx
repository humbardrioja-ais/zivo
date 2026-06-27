import { Shield } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'Roles — Administration — Zivo OS' }

export default function RolesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Roles"
        description="Define roles and their associated permission sets."
      />
      <EmptyState
        icon={Shield}
        title="No data yet"
        description="Role definitions will be configured here."
      />
    </PageLayout>
  )
}
