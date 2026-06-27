import { Building2 } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'Organization — System — Zivo OS' }

export default function OrganizationPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Organization"
        description="Manage your company profile, branding, and general information."
      />
      <EmptyState
        icon={Building2}
        title="No data yet"
        description="Organization settings will be configured here."
      />
    </PageLayout>
  )
}
