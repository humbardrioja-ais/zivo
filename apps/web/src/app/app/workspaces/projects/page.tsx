import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { ProjectsTable } from './projects-table'
import { getProjects } from './actions'
import { getOrgMembers } from '@/lib/workflow/members'

export const metadata = { title: 'Projects — Zivo OS' }

export default async function ProjectsPage() {
  const [projects, members] = await Promise.all([getProjects(), getOrgMembers()])
  return (
    <PageLayout>
      <PageHeader title="Projects" description="Plan and track work across your organization." />
      <ProjectsTable initial={projects} members={members} />
    </PageLayout>
  )
}
