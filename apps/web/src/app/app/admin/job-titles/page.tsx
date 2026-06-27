import { Briefcase } from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export const metadata = { title: 'Job Titles — Administration — Zivo OS' }

export default function JobTitlesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Job Titles"
        description="Manage the catalog of positions available across the organization."
      />
      <EmptyState
        icon={Briefcase}
        title="No data yet"
        description="Job titles will be defined here."
      />
    </PageLayout>
  )
}
