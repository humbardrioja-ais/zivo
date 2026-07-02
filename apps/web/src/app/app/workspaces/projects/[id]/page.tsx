import { notFound } from 'next/navigation'
import { getProject, getProjectMembers, getProjectAreas } from '../actions'
import { getProjectTasks } from '../../tasks/actions'
import { getOrgMembers } from '@/lib/workflow/members'
import { ProjectDetail } from './project-detail'

export const metadata = { title: 'Project — Zivo OS' }

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)
  if (!project) notFound()

  const [members, areas, tasks, orgMembers] = await Promise.all([
    getProjectMembers(id),
    getProjectAreas(id),
    getProjectTasks(id),
    getOrgMembers(),
  ])

  return (
    <ProjectDetail
      project={project}
      initialMembers={members}
      initialAreas={areas}
      initialTasks={tasks}
      orgMembers={orgMembers}
    />
  )
}
