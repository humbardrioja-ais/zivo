import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { UsersTable } from './users-table'
import { getUsers } from './actions'
import { getBranches } from '../branches/actions'
import { getDepartments } from '../departments/actions'
import { getJobTitles } from '../job-titles/actions'
import { getRoles } from '../roles/actions'
import { getEmploymentTypes } from '../employment-types/actions'

export const metadata = { title: 'Users — System — Zivo OS' }

export default async function UsersPage() {
  const [users, branches, departments, jobTitles, roles, employmentTypes] = await Promise.all([
    getUsers(), getBranches(), getDepartments(), getJobTitles(), getRoles(), getEmploymentTypes(),
  ])
  return (
    <PageLayout>
      <PageHeader title="Users" description="Manage organizational member assignments." />
      <UsersTable initial={users} branches={branches} departments={departments}
        jobTitles={jobTitles} roles={roles} employmentTypes={employmentTypes} />
    </PageLayout>
  )
}
