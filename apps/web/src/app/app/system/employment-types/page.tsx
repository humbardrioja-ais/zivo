import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { EmploymentTypesTable } from './employment-types-table'
import { getEmploymentTypes } from './actions'

export const metadata = { title: 'Employment Types — System — Zivo OS' }

export default async function EmploymentTypesPage() {
  const types = await getEmploymentTypes()
  return (
    <PageLayout>
      <PageHeader title="Employment Types" description="Define employment categories like full-time, part-time, and contract." />
      <EmploymentTypesTable initial={types} />
    </PageLayout>
  )
}
