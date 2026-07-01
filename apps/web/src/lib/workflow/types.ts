/**
 * Zivo OS — Workflow Foundation
 *
 * Shared domain contracts for the future Workflow & Task Engine.
 * Projects, Tasks, Meetings, Calendar, CRM, HR, and Finance modules will all
 * produce and consume these types, so the Home dashboard (and any future
 * aggregate view) can render a unified experience without per-module glue.
 *
 * These are UI/service contracts only — they do NOT define database schema.
 * When a module ships its own tables, its service maps rows onto these types.
 */

export type WorkItemPriority = 'urgent' | 'high' | 'medium' | 'low'

export type WorkItemStatus =
  | 'todo'
  | 'in_progress'
  | 'blocked'
  | 'in_review'
  | 'done'
  | 'cancelled'

/** The module that owns a work item — lets the dashboard route and label items. */
export type WorkflowModule =
  | 'projects'
  | 'tasks'
  | 'meetings'
  | 'calendar'
  | 'crm'
  | 'hr'
  | 'finance'

/** A person referenced by any workflow item — always an organization member. */
export interface WorkflowActor {
  memberId: string
  displayName: string
  avatarUrl: string | null
}

/**
 * A unit of work surfaced anywhere in the product (a task, a CRM follow-up,
 * an approval, an HR request). The engine treats them uniformly.
 */
export interface WorkItem {
  id: string
  module: WorkflowModule
  title: string
  status: WorkItemStatus
  priority: WorkItemPriority
  assignee: WorkflowActor | null
  dueAt: string | null
  href: string
  updatedAt: string
}

/** A meeting or calendar event relevant to the current user today. */
export interface MeetingSummary {
  id: string
  title: string
  startAt: string
  endAt: string | null
  location: string | null
  href: string
  attendees: number
}

/** A dated obligation surfaced under "Upcoming Deadlines". */
export interface DeadlineItem {
  id: string
  module: WorkflowModule
  title: string
  dueAt: string
  href: string
}

/** A project the user has pinned or is actively working in. */
export interface ProjectSummary {
  id: string
  name: string
  status: WorkItemStatus
  openItems: number
  href: string
}

/** An audit-style event for the "Recent Activity" feed. */
export interface ActivityEvent {
  id: string
  module: WorkflowModule
  actor: WorkflowActor | null
  action: string
  target: string
  href: string | null
  occurredAt: string
}

/** Everything the Home dashboard needs, aggregated in one shape. */
export interface DashboardData {
  continueWorking: WorkItem[]
  myTasks: WorkItem[]
  todaysMeetings: MeetingSummary[]
  upcomingDeadlines: DeadlineItem[]
  recentActivity: ActivityEvent[]
  pinnedProjects: ProjectSummary[]
}

export const PRIORITY_ORDER: Record<WorkItemPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export const STATUS_LABELS: Record<WorkItemStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  in_review: 'In review',
  done: 'Done',
  cancelled: 'Cancelled',
}
