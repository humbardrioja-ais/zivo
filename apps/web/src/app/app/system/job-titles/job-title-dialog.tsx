'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createJobTitle, updateJobTitle, type JobTitle } from './actions'
import type { Department } from '../departments/actions'

interface JobTitleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobTitle: JobTitle | null
  departments: Department[]
  onSaved: () => void
}

function JobTitleForm({ jobTitle, departments, onOpenChange, onSaved }: Omit<JobTitleDialogProps, 'open'>) {
  const isEdit = !!jobTitle
  const [form, setForm] = useState({
    title: jobTitle?.title ?? '',
    code: jobTitle?.code ?? '',
    department_id: jobTitle?.department_id ?? '',
    description: jobTitle?.description ?? '',
    status: jobTitle?.status ?? 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Job title is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit ? await updateJobTitle(jobTitle.id, form) : await createJobTitle(form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Job Title' : 'Add Job Title'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update job title details.' : 'Create a new job title.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="jt-title">Title <span className="text-destructive">*</span></Label>
          <Input id="jt-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Software Engineer" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jt-code">Code</Label>
          <Input id="jt-code" value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="SWE" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jt-dept">Department</Label>
          <Select value={form.department_id} onValueChange={(v) => update('department_id', v)}>
            <SelectTrigger id="jt-dept"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {departments.filter((d) => d.status === 'active').map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jt-desc">Description</Label>
          <Textarea id="jt-desc" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Responsibilities and scope" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jt-status">Status</Label>
          <Select value={form.status} onValueChange={(v) => update('status', v)}>
            <SelectTrigger id="jt-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Job Title'}</Button>
      </DialogFooter>
    </>
  )
}

export function JobTitleDialog({ open, onOpenChange, jobTitle, departments, onSaved }: JobTitleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && <JobTitleForm key={jobTitle?.id ?? 'new'} jobTitle={jobTitle} departments={departments} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
