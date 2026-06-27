import { Users } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'Users — System — Zivo OS' }

export default function UsersPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Users"
        description="Manage user accounts, invitations, and access."
      />
      <EmptyState
        icon={Users}
        title="No data yet"
        description="User management will be available here."
      />
    </PageLayout>
  )
}
