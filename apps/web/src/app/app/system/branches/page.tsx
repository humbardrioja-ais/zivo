import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { BranchesTable } from './branches-table'
import { getBranches } from './actions'

export const metadata = { title: 'Branches — System — Zivo OS' }

export default async function BranchesPage() {
  const branches = await getBranches()
  return (
    <PageLayout>
      <PageHeader title="Branches" description="Manage your organization's office locations and branches." />
      <BranchesTable initial={branches} />
    </PageLayout>
  )
}
