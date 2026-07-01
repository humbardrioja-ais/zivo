import { getWorkflowContext, type WorkflowContext } from './context'
import type {
  DashboardData,
  WorkItem,
  MeetingSummary,
  DeadlineItem,
  ActivityEvent,
  ProjectSummary,
} from './types'

/**
 * A dashboard source contributes one section's data for the current context.
 * Future modules (Projects, Tasks, Meetings, …) implement these against their
 * own tables and register them below. Until a module ships, its source returns
 * an empty result — so the dashboard renders honest empty states, never fake
 * data, and gains real content the moment a module is wired in.
 */
export interface DashboardSources {
  continueWorking(ctx: WorkflowContext): Promise<WorkItem[]>
  myTasks(ctx: WorkflowContext): Promise<WorkItem[]>
  todaysMeetings(ctx: WorkflowContext): Promise<MeetingSummary[]>
  upcomingDeadlines(ctx: WorkflowContext): Promise<DeadlineItem[]>
  recentActivity(ctx: WorkflowContext): Promise<ActivityEvent[]>
  pinnedProjects(ctx: WorkflowContext): Promise<ProjectSummary[]>
}

/**
 * Default sources — empty until the owning modules exist. Replace individual
 * methods here (or compose module-provided sources) as modules ship.
 */
const defaultSources: DashboardSources = {
  async continueWorking() { return [] },
  async myTasks() { return [] },
  async todaysMeetings() { return [] },
  async upcomingDeadlines() { return [] },
  async recentActivity() { return [] },
  async pinnedProjects() { return [] },
}

/**
 * Aggregates every section for the Home dashboard in a single call.
 * Sources run in parallel; a failing source degrades to an empty section
 * rather than breaking the whole page.
 */
export async function getDashboardData(
  sources: DashboardSources = defaultSources,
): Promise<{ context: WorkflowContext; data: DashboardData }> {
  const context = await getWorkflowContext()

  const settle = async <T>(p: Promise<T[]>): Promise<T[]> => {
    try {
      return await p
    } catch {
      return []
    }
  }

  const [
    continueWorking,
    myTasks,
    todaysMeetings,
    upcomingDeadlines,
    recentActivity,
    pinnedProjects,
  ] = await Promise.all([
    settle(sources.continueWorking(context)),
    settle(sources.myTasks(context)),
    settle(sources.todaysMeetings(context)),
    settle(sources.upcomingDeadlines(context)),
    settle(sources.recentActivity(context)),
    settle(sources.pinnedProjects(context)),
  ])

  return {
    context,
    data: {
      continueWorking,
      myTasks,
      todaysMeetings,
      upcomingDeadlines,
      recentActivity,
      pinnedProjects,
    },
  }
}
