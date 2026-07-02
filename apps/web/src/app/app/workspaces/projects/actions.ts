'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type Project = {
  id: string
  organization_id: string
  name: string
  code: string | null
  description: string | null
  status: string
  lead_id: string | null
  start_date: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}

export type ProjectMember = {
  id: string
  project_id: string
  member_id: string
  role: string
  created_at: string
  display_name: string | null
}

export type ProjectArea = {
  id: string
  project_id: string
  name: string
  description: string | null
  status: string
  position: number
  created_at: string
  updated_at: string
}

type ProjectForm = {
  name: string
  code: string
  description: string
  status: string
  lead_id: string
  start_date: string
  due_date: string
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to load projects: ${error.message}`)
  return (data ?? []) as Project[]
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).single()
  return (data as Project) ?? null
}

export async function createProject(form: ProjectForm): Promise<{ error: string; id?: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase.from('projects').insert({
    organization_id: orgId,
    name: form.name,
    code: form.code || null,
    description: form.description || null,
    status: form.status,
    lead_id: form.lead_id || null,
    start_date: form.start_date || null,
    due_date: form.due_date || null,
  }).select('id').single()
  if (error || !data) return { error: `Failed to create project: ${error?.message}` }

  // The lead is automatically a project member with the 'lead' role.
  if (form.lead_id) {
    await supabase.from('project_members').insert({
      project_id: data.id, member_id: form.lead_id, role: 'lead',
    })
  }

  revalidatePath('/app/workspaces/projects')
  return { error: '', id: data.id }
}

export async function updateProject(id: string, form: ProjectForm): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update({
    name: form.name,
    code: form.code || null,
    description: form.description || null,
    status: form.status,
    lead_id: form.lead_id || null,
    start_date: form.start_date || null,
    due_date: form.due_date || null,
  }).eq('id', id)
  if (error) return { error: `Failed to update project: ${error.message}` }
  revalidatePath('/app/workspaces/projects')
  revalidatePath(`/app/workspaces/projects/${id}`)
  return { error: '' }
}

export async function deleteProject(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { error: `Failed to delete project: ${error.message}` }
  revalidatePath('/app/workspaces/projects')
  return { error: '' }
}

// ---- Project Members ----

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project_members')
    .select('*, organization_members(user_profiles(display_name))')
    .eq('project_id', projectId)
  if (error) return []
  return (data ?? []).map((m: Record<string, unknown>) => {
    const om = m.organization_members as Record<string, unknown> | null
    const profile = om?.user_profiles as Record<string, unknown> | null
    return { ...m, display_name: (profile?.display_name as string | null) ?? null }
  }) as ProjectMember[]
}

export async function addProjectMember(projectId: string, memberId: string, role: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('project_members').insert({
    project_id: projectId, member_id: memberId, role,
  })
  if (error) return { error: `Failed to add member: ${error.message}` }
  revalidatePath(`/app/workspaces/projects/${projectId}`)
  return { error: '' }
}

export async function removeProjectMember(id: string, projectId: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('project_members').delete().eq('id', id)
  if (error) return { error: `Failed to remove member: ${error.message}` }
  revalidatePath(`/app/workspaces/projects/${projectId}`)
  return { error: '' }
}

// ---- Project Areas ----

export async function getProjectAreas(projectId: string): Promise<ProjectArea[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project_areas')
    .select('*')
    .eq('project_id', projectId)
    .order('position')
    .order('created_at')
  if (error) return []
  return (data ?? []) as ProjectArea[]
}

export async function createProjectArea(projectId: string, form: { name: string; description: string; status: string }): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('project_areas').insert({
    project_id: projectId, name: form.name, description: form.description || null, status: form.status,
  })
  if (error) return { error: `Failed to create area: ${error.message}` }
  revalidatePath(`/app/workspaces/projects/${projectId}`)
  return { error: '' }
}

export async function updateProjectArea(id: string, projectId: string, form: { name: string; description: string; status: string }): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('project_areas').update({
    name: form.name, description: form.description || null, status: form.status,
  }).eq('id', id)
  if (error) return { error: `Failed to update area: ${error.message}` }
  revalidatePath(`/app/workspaces/projects/${projectId}`)
  return { error: '' }
}

export async function deleteProjectArea(id: string, projectId: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('project_areas').delete().eq('id', id)
  if (error) return { error: `Failed to delete area: ${error.message}` }
  revalidatePath(`/app/workspaces/projects/${projectId}`)
  return { error: '' }
}
