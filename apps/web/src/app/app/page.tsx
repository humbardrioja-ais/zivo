import {
  PlayCircle,
  CheckSquare,
  Video,
  CalendarClock,
  Activity,
  Pin,
} from 'lucide-react'
import { PageLayout } from '@/components/shared/page-layout'
import { getDashboardData } from '@/lib/workflow/dashboard-service'
import { WelcomeSection } from './_dashboard/welcome-section'
import { QuickCreate } from './_dashboard/quick-create'
import { DashboardCard } from './_dashboard/dashboard-card'
import { WorkItemRow } from './_dashboard/work-item-row'
import { MeetingRow, DeadlineRow, ActivityRow, ProjectRow } from './_dashboard/rows'

export const metadata = { title: 'Home — Zivo OS' }

export default async function HomePage() {
  const { context, data } = await getDashboardData()

  return (
    <PageLayout>
      <WelcomeSection
        displayName={context.displayName}
        openTasks={data.myTasks.length}
        meetingsToday={data.todaysMeetings.length}
      />

      <QuickCreate />

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard
          title="Continue Working"
          icon={PlayCircle}
          isEmpty={data.continueWorking.length === 0}
          emptyText="Nothing in progress. Pick something up to see it here."
        >
          <div className="space-y-1">
            {data.continueWorking.map((item) => (
              <WorkItemRow key={item.id} item={item} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="My Tasks"
          icon={CheckSquare}
          action={{ label: 'All tasks', href: '/app/workspaces/tasks' }}
          isEmpty={data.myTasks.length === 0}
          emptyText="No tasks assigned to you. Enjoy the calm."
        >
          <div className="space-y-1">
            {data.myTasks.map((item) => (
              <WorkItemRow key={item.id} item={item} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Today's Meetings"
          icon={Video}
          action={{ label: 'Calendar', href: '/app/calendar' }}
          isEmpty={data.todaysMeetings.length === 0}
          emptyText="No meetings today. Time to focus."
        >
          <div className="space-y-1">
            {data.todaysMeetings.map((m) => (
              <MeetingRow key={m.id} meeting={m} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Upcoming Deadlines"
          icon={CalendarClock}
          isEmpty={data.upcomingDeadlines.length === 0}
          emptyText="No deadlines on the horizon."
        >
          <div className="space-y-1">
            {data.upcomingDeadlines.map((d) => (
              <DeadlineRow key={d.id} deadline={d} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Pinned Projects"
          icon={Pin}
          action={{ label: 'Projects', href: '/app/workspaces/projects' }}
          isEmpty={data.pinnedProjects.length === 0}
          emptyText="Pin a project to keep it close."
        >
          <div className="space-y-1">
            {data.pinnedProjects.map((p) => (
              <ProjectRow key={p.id} project={p} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Activity"
          icon={Activity}
          isEmpty={data.recentActivity.length === 0}
          emptyText="No recent activity in your workspace yet."
        >
          <div className="divide-y">
            {data.recentActivity.map((e) => (
              <ActivityRow key={e.id} event={e} />
            ))}
          </div>
        </DashboardCard>
      </div>
    </PageLayout>
  )
}
