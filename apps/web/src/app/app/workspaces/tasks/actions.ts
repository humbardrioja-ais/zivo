'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type Task = {
  id: string
  organization_id: string
  project_id: string | null
  area_id: string | null
  title: string
  description: string | null
  status: string
  priority: string
  assignee_id: string | null
  due_date: string | null
  position: number
  created_at: string
  updated_at: string
  assignee_name: string | null
  project_name: string | null
}

export type TaskForm = {
  title: string
  description: string
  project_id: string
  area_id: string
  status: string
  priority: string
  assignee_id: string
  due_date: string
}

// Resolve assignee display names for a set of tasks (org_members → user_profiles,
// which share no FK) and project names (FK embed unavailable cross-file, resolved here).
async function decorate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: Record<string, unknown>[],
): Promise<Task[]> {
  const memberIds = [...new Set(rows.map((r) => r.assignee_id as string | null).filter(Boolean) as string[])]
  const projectIds = [...new Set(rows.map((r) => r.project_id as string | null).filter(Boolean) as string[])]

  const nameByMember: Record<string, string> = {}
  if (memberIds.length > 0) {
    const { data: oms } = await supabase.from('organization_members').select('id, user_id').in('id', memberIds)
    const userIds = (oms ?? []).map((o: Record<string, unknown>) => o.user_id as string)
    const nameByUser: Record<string, string> = {}
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from('user_profiles').select('id, display_name').in('id', userIds)
      for (const p of profiles ?? []) {
        const n = (p.display_name as string | null)?.trim()
        if (n) nameByUser[p.id as string] = n
      }
    }
    for (const o of oms ?? []) {
      const n = nameByUser[o.user_id as string]
      if (n) nameByMember[o.id as string] = n
    }
  }

  const projectName: Record<string, string> = {}
  if (projectIds.length > 0) {
    const { data: projs } = await supabase.from('projects').select('id, name').in('id', projectIds)
    for (const p of projs ?? []) projectName[p.id as string] = p.name as string
  }

  return rows.map((r) => ({
    ...r,
    assignee_name: r.assignee_id ? nameByMember[r.assignee_id as string] ?? null : null,
    project_name: r.project_id ? projectName[r.project_id as string] ?? null : null,
  })) as Task[]
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase
    .from('tasks').select('*').eq('organization_id', orgId).order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to load tasks: ${error.message}`)
  return decorate(supabase, data ?? [])
}

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks').select('*').eq('project_id', projectId).order('position').order('created_at')
  if (error) return []
  return decorate(supabase, data ?? [])
}

export async function createTask(form: TaskForm): Promise<{ error: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { error } = await supabase.from('tasks').insert({
    organization_id: orgId,
    title: form.title,
    description: form.description || null,
    project_id: form.project_id || null,
    area_id: form.area_id || null,
    status: form.status,
    priority: form.priority,
    assignee_id: form.assignee_id || null,
    due_date: form.due_date || null,
  })
  if (error) return { error: `Failed to create task: ${error.message}` }
  revalidatePath('/app/workspaces/tasks')
  if (form.project_id) revalidatePath(`/app/workspaces/projects/${form.project_id}`)
  return { error: '' }
}

export async function updateTask(id: string, form: TaskForm): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({
    title: form.title,
    description: form.description || null,
    project_id: form.project_id || null,
    area_id: form.area_id || null,
    status: form.status,
    priority: form.priority,
    assignee_id: form.assignee_id || null,
    due_date: form.due_date || null,
  }).eq('id', id)
  if (error) return { error: `Failed to update task: ${error.message}` }
  revalidatePath('/app/workspaces/tasks')
  if (form.project_id) revalidatePath(`/app/workspaces/projects/${form.project_id}`)
  return { error: '' }
}

export async function updateTaskStatus(id: string, status: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) return { error: `Failed to update status: ${error.message}` }
  revalidatePath('/app/workspaces/tasks')
  return { error: '' }
}

export async function deleteTask(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) return { error: `Failed to delete task: ${error.message}` }
  revalidatePath('/app/workspaces/tasks')
  return { error: '' }
}
