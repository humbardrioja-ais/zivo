import Link from 'next/link'
import { Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { clockTime, dueLabel, relativeTime } from '@/lib/workflow/format'
import type {
  MeetingSummary,
  DeadlineItem,
  ActivityEvent,
  ProjectSummary,
} from '@/lib/workflow/types'

export function MeetingRow({ meeting }: { meeting: MeetingSummary }) {
  return (
    <Link
      href={meeting.href}
      className="flex items-center justify-between gap-3 rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-accent"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {clockTime(meeting.startAt)}
        </span>
        <span className="truncate text-sm">{meeting.title}</span>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        {meeting.attendees}
      </span>
    </Link>
  )
}

export function DeadlineRow({ deadline }: { deadline: DeadlineItem }) {
  return (
    <Link
      href={deadline.href}
      className="flex items-center justify-between gap-3 rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-accent"
    >
      <span className="truncate text-sm">{deadline.title}</span>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {dueLabel(deadline.dueAt)}
      </span>
    </Link>
  )
}

export function ActivityRow({ event }: { event: ActivityEvent }) {
  const body = (
    <div className="flex items-start justify-between gap-3 py-2">
      <p className="min-w-0 text-sm">
        <span className="font-medium">{event.actor?.displayName ?? 'Someone'}</span>{' '}
        <span className="text-muted-foreground">{event.action}</span>{' '}
        <span>{event.target}</span>
      </p>
      <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(event.occurredAt)}</span>
    </div>
  )
  return event.href ? (
    <Link href={event.href} className="block rounded-md px-2 -mx-2 transition-colors hover:bg-accent">
      {body}
    </Link>
  ) : (
    <div className="px-2 -mx-2">{body}</div>
  )
}

export function ProjectRow({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={project.href}
      className="flex items-center justify-between gap-3 rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-accent"
    >
      <span className="truncate text-sm font-medium">{project.name}</span>
      <Badge variant="secondary" className="text-xs font-normal">
        {project.openItems} open
      </Badge>
    </Link>
  )
}
