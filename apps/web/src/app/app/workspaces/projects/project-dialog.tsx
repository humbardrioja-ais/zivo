'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createProject, updateProject, type Project } from './actions'
import type { OrgMemberOption } from '@/lib/workflow/members'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  members: OrgMemberOption[]
  onSaved: () => void
}

const STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

function ProjectForm({ project, members, onOpenChange, onSaved }: Omit<ProjectDialogProps, 'open'>) {
  const router = useRouter()
  const isEdit = !!project
  const [form, setForm] = useState({
    name: project?.name ?? '',
    code: project?.code ?? '',
    description: project?.description ?? '',
    status: project?.status ?? 'planning',
    lead_id: project?.lead_id ?? '',
    start_date: project?.start_date ?? '',
    due_date: project?.due_date ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Project name is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit ? await updateProject(project.id, form) : await createProject(form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
    router.refresh()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update project details.' : 'Create a new project.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="p-name">Name <span className="text-destructive">*</span></Label>
            <Input id="p-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Website Redesign" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-code">Code</Label>
            <Input id="p-code" value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="WEB" className="w-28" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-desc">Description</Label>
          <Textarea id="p-desc" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What this project is about" rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p-status">Status</Label>
            <Select value={form.status} onValueChange={(v) => update('status', v)}>
              <SelectTrigger id="p-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-lead">Project Lead</Label>
            <Select value={form.lead_id} onValueChange={(v) => update('lead_id', v)}>
              <SelectTrigger id="p-lead"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {members.map((m) => (<SelectItem key={m.id} value={m.id}>{m.displayName}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p-start">Start Date</Label>
            <Input id="p-start" type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-due">Due Date</Label>
            <Input id="p-due" type="date" value={form.due_date} onChange={(e) => update('due_date', e.target.value)} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}</Button>
      </DialogFooter>
    </>
  )
}

export function ProjectDialog({ open, onOpenChange, project, members, onSaved }: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <ProjectForm key={project?.id ?? 'new'} project={project} members={members} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
