import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { DepartmentsTable } from './departments-table'
import { getDepartments } from './actions'
import { getBranches } from '../branches/actions'

export const metadata = { title: 'Departments — System — Zivo OS' }

export default async function DepartmentsPage() {
  const [departments, branches] = await Promise.all([getDepartments(), getBranches()])
  return (
    <PageLayout>
      <PageHeader title="Departments" description="Define your organizational structure and department hierarchy." />
      <DepartmentsTable initial={departments} branches={branches} />
    </PageLayout>
  )
}
