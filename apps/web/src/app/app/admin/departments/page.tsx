import { Network } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'Departments — Administration — Zivo OS' }

export default function DepartmentsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Departments"
        description="Define your organizational structure and department hierarchy."
      />
      <EmptyState
        icon={Network}
        title="No data yet"
        description="Departments will be managed here."
      />
    </PageLayout>
  )
}
