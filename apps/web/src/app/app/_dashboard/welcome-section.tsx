import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { greeting, longDate } from '@/lib/workflow/format'

interface WelcomeSectionProps {
  displayName: string
  openTasks: number
  meetingsToday: number
}

/**
 * Welcome — orients the user the moment they land. The summary line answers
 * "what needs my attention?" at a glance. The AI Summary strip is a reserved
 * placeholder for a future assistant-generated daily briefing.
 */
export function WelcomeSection({ displayName, openTasks, meetingsToday }: WelcomeSectionProps) {
  const parts: string[] = []
  if (openTasks > 0) parts.push(`${openTasks} open task${openTasks === 1 ? '' : 's'}`)
  if (meetingsToday > 0) parts.push(`${meetingsToday} meeting${meetingsToday === 1 ? '' : 's'} today`)
  const summary = parts.length > 0 ? `You have ${parts.join(' and ')}.` : "You're all caught up."

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}, {displayName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {longDate()} · {summary}
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">AI Daily Summary</p>
            <p className="text-xs text-muted-foreground">
              Your personalized briefing will appear here once the AI Assistant is enabled.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
