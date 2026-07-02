'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Combobox } from '@/components/ui/combobox'
import { MemberPicker } from '@/components/shared/member-picker'
import { DatePicker } from '@/components/shared/date-picker'
import { RichTextEditor } from '@/components/shared/rich-text-editor'
import { createTask, updateTask, type Task } from './actions'
import type { OrgMemberOption } from '@/lib/workflow/members'

export interface ProjectOption { id: string; name: string }
export interface AreaOption { id: string; name: string }

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  members: OrgMemberOption[]
  projects?: ProjectOption[]
  fixedProjectId?: string
  areas?: AreaOption[]
  onSaved: () => void
}

const STATUSES = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'in_review', label: 'In review' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
]
const PRIORITIES = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

function TaskForm({ task, members, projects, fixedProjectId, areas, onOpenChange, onSaved }: Omit<TaskDialogProps, 'open'>) {
  const router = useRouter()
  const isEdit = !!task
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    project_id: task?.project_id ?? fixedProjectId ?? '',
    area_id: task?.area_id ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    assignee_id: task?.assignee_id ?? '',
    due_date: task?.due_date ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Task title is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit ? await updateTask(task.id, form) : await createTask(form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
    router.refresh()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update task details.' : 'Create a new task.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="t-title">Title <span className="text-destructive">*</span></Label>
          <Input id="t-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Design the landing page" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-desc">Description</Label>
          <RichTextEditor value={form.description} onChange={(html) => update('description', html)} placeholder="Add detail, checklists, links…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="t-status">Status</Label>
            <Select value={form.status} onValueChange={(v) => update('status', v)}>
              <SelectTrigger id="t-status"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-priority">Priority</Label>
            <Select value={form.priority} onValueChange={(v) => update('priority', v)}>
              <SelectTrigger id="t-priority"><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="t-assignee">Assignee</Label>
            <MemberPicker id="t-assignee" members={members} value={form.assignee_id || null} onValueChange={(v) => update('assignee_id', v)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-due">Due Date</Label>
            <DatePicker id="t-due" value={form.due_date} onChange={(v) => update('due_date', v)} />
          </div>
        </div>
        {!fixedProjectId && projects && (
          <div className="space-y-2">
            <Label htmlFor="t-project">Project</Label>
            <Combobox id="t-project" items={projects.map((p) => ({ value: p.id, label: p.name }))}
              value={form.project_id || null} onValueChange={(v) => update('project_id', v)} placeholder="No project" emptyText="No projects." />
          </div>
        )}
        {fixedProjectId && areas && areas.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="t-area">Area</Label>
            <Select value={form.area_id} onValueChange={(v) => update('area_id', v)}>
              <SelectTrigger id="t-area"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {areas.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}</Button>
      </DialogFooter>
    </>
  )
}

export function TaskDialog({ open, onOpenChange, ...rest }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <TaskForm key={rest.task?.id ?? 'new'} onOpenChange={onOpenChange} {...rest} />}
      </DialogContent>
    </Dialog>
  )
}
