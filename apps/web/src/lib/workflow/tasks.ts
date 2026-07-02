import { createClient } from '@/lib/supabase/server'
import type { WorkflowContext } from './context'
import type { WorkItem, WorkItemPriority, WorkItemStatus } from './types'

const OPEN_STATUSES = ['todo', 'in_progress', 'blocked', 'in_review']

/**
 * Tasks assigned to the current member that are still open, newest-updated
 * first, mapped onto the shared WorkItem contract for the Home dashboard.
 * Safe to call before the tasks table exists — returns [] on any error.
 */
export async function getMyOpenTasks(ctx: WorkflowContext): Promise<WorkItem[]> {
  if (!ctx.memberId) return []
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, status, priority, due_date, updated_at, project_id')
    .eq('organization_id', ctx.organizationId)
    .eq('assignee_id', ctx.memberId)
    .in('status', OPEN_STATUSES)
    .order('updated_at', { ascending: false })
    .limit(8)

  if (error || !data) return []

  return data.map((t: Record<string, unknown>): WorkItem => ({
    id: t.id as string,
    module: 'tasks',
    title: t.title as string,
    status: t.status as WorkItemStatus,
    priority: t.priority as WorkItemPriority,
    assignee: null,
    dueAt: (t.due_date as string | null) ?? null,
    href: '/app/workspaces/tasks',
    updatedAt: t.updated_at as string,
  }))
}
