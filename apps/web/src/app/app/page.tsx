import { LayoutDashboard } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = {
  title: 'Dashboard — Zivo OS',
}

export default function DashboardPage() {
  return (
    <PageLayout>
      <PageHeader title="Dashboard" description="Your workspace at a glance." />
      <EmptyState
        icon={LayoutDashboard}
        title="Dashboard coming soon"
        description="Widgets and insights will appear here in an upcoming release."
      />
    </PageLayout>
  )
}
