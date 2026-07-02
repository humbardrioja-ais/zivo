'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, CheckSquare, LayoutList, Columns3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { WorkStatusBadge } from '@/components/shared/work-status-badge'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { dueLabel } from '@/lib/workflow/format'
import { STATUS_LABELS, type WorkItemStatus } from '@/lib/workflow/types'
import { cn } from '@/lib/utils'
import { TaskDialog, type ProjectOption, type AreaOption } from './task-dialog'
import { getTasks, getProjectTasks, updateTaskStatus, deleteTask, type Task } from './actions'
import type { OrgMemberOption } from '@/lib/workflow/members'

const BOARD_COLUMNS: WorkItemStatus[] = ['todo', 'in_progress', 'blocked', 'in_review', 'done']
const NEXT_STATUS: Record<string, WorkItemStatus> = {
  todo: 'in_progress', in_progress: 'in_review', in_review: 'done', blocked: 'in_progress', done: 'todo', cancelled: 'todo',
}

interface TasksViewProps {
  initial: Task[]
  members: OrgMemberOption[]
  projects?: ProjectOption[]
  fixedProjectId?: string
  areas?: AreaOption[]
}

export function TasksView({ initial, members, projects, fixedProjectId, areas }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initial)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [view, setView] = useState<'list' | 'board'>('list')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)

  const refresh = useCallback(async () => {
    setTasks(fixedProjectId ? await getProjectTasks(fixedProjectId) : await getTasks())
  }, [fixedProjectId])

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || t.status === statusFilter),
  )

  function openCreate() { setEditing(null); setDialogOpen(true) }
  function openEdit(t: Task) { setEditing(t); setDialogOpen(true) }

  async function advance(t: Task) {
    await updateTaskStatus(t.id, NEXT_STATUS[t.status] ?? 'todo')
    await refresh()
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteTask(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search tasks..."
        actions={
          <>
            <div className="flex rounded-lg border p-0.5">
              <button onClick={() => setView('list')} aria-label="List view"
                className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md', view === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground')}>
                <LayoutList className="h-4 w-4" />
              </button>
              <button onClick={() => setView('board')} aria-label="Board view"
                className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md', view === 'board' ? 'bg-accent text-foreground' : 'text-muted-foreground')}>
                <Columns3 className="h-4 w-4" />
              </button>
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (<SelectItem key={v} value={v}>{l}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Task</Button>
          </>
        }
      />

      {tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks yet" description="Create your first task to start tracking work."
          actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Task</Button>} />
      ) : view === 'list' ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                {!fixedProjectId && <TableHead>Project</TableHead>}
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => openEdit(t)}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                  <TableCell>{t.assignee_name || '—'}</TableCell>
                  {!fixedProjectId && <TableCell className="text-muted-foreground">{t.project_name || '—'}</TableCell>}
                  <TableCell className="text-muted-foreground">{t.due_date ? dueLabel(t.due_date) : '—'}</TableCell>
                  <TableCell><WorkStatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(t)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={fixedProjectId ? 6 : 7} className="text-center text-muted-foreground py-8">No tasks match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {BOARD_COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col)
            return (
              <div key={col} className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{STATUS_LABELS[col]}</span>
                  <span className="text-xs text-muted-foreground">{colTasks.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {colTasks.map((t) => (
                    <button key={t.id} onClick={() => openEdit(t)}
                      className="rounded-lg border bg-card p-2.5 text-left shadow-sm transition-colors hover:border-primary/30">
                      <p className="text-sm font-medium">{t.title}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <PriorityBadge priority={t.priority} />
                        {t.due_date && <span className="text-xs text-muted-foreground">{dueLabel(t.due_date)}</span>}
                      </div>
                      {t.assignee_name && <p className="mt-1.5 text-xs text-muted-foreground">{t.assignee_name}</p>}
                      <span role="button" tabIndex={-1} onClick={(e) => { e.stopPropagation(); advance(t) }}
                        className="mt-2 inline-block text-xs text-muted-foreground hover:text-foreground">
                        Move to {STATUS_LABELS[NEXT_STATUS[t.status]]} →
                      </span>
                    </button>
                  ))}
                  {colTasks.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">Empty</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editing} members={members}
        projects={projects} fixedProjectId={fixedProjectId} areas={areas} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Task" description={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
