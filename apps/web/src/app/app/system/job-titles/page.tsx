import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { JobTitlesTable } from './job-titles-table'
import { getJobTitles } from './actions'
import { getDepartments } from '../departments/actions'

export const metadata = { title: 'Job Titles — System — Zivo OS' }

export default async function JobTitlesPage() {
  const [jobTitles, departments] = await Promise.all([getJobTitles(), getDepartments()])

  return (
    <PageLayout>
      <PageHeader title="Job Titles" description="Manage the catalog of positions available across the organization." />
      <JobTitlesTable initial={jobTitles} departments={departments} />
    </PageLayout>
  )
}
