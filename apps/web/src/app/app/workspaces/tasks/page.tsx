import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { TasksView } from './tasks-view'
import { getTasks } from './actions'
import { getOrgMembers } from '@/lib/workflow/members'
import { getProjects } from '../projects/actions'

export const metadata = { title: 'Tasks — Zivo OS' }

export default async function TasksPage() {
  const [tasks, members, projects] = await Promise.all([getTasks(), getOrgMembers(), getProjects()])
  return (
    <PageLayout>
      <PageHeader title="Tasks" description="Track and manage work across all your projects." />
      <TasksView initial={tasks} members={members} projects={projects.map((p) => ({ id: p.id, name: p.name }))} />
    </PageLayout>
  )
}
