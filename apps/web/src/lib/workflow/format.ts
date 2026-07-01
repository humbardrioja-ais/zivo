/** Time-of-day greeting. Pure function of the given hour (defaults to now). */
export function greeting(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** "Monday, June 28" — long weekday + month + day, no year noise. */
export function longDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/** "9:30 AM" */
export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Compact relative time: "just now", "5m ago", "3h ago", "2d ago", else date. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime()
  const diffMs = now.getTime() - then
  const min = Math.round(diffMs / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Human due-date label with urgency awareness. */
export function dueLabel(iso: string, now: Date = new Date()): string {
  const due = new Date(iso)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const days = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86400000)
  if (days < 0) return `Overdue by ${Math.abs(days)}d`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days < 7) return `Due in ${days}d`
  return `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}
