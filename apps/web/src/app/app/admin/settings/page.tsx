import { Settings } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'System Settings — Administration — Zivo OS' }

export default function SystemSettingsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="System Settings"
        description="Configure platform-wide preferences, integrations, and policies."
      />
      <EmptyState
        icon={Settings}
        title="No data yet"
        description="System configuration options will appear here."
      />
    </PageLayout>
  )
}
