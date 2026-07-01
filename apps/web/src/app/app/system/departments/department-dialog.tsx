'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createDepartment, updateDepartment, type Department } from './actions'
import type { Branch } from '../branches/actions'

interface DepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
  departments: Department[]
  branches: Branch[]
  onSaved: () => void
}

function DeptForm({ department, departments, branches, onOpenChange, onSaved }: Omit<DepartmentDialogProps, 'open'>) {
  const isEdit = !!department
  const [form, setForm] = useState({
    name: department?.name ?? '',
    code: department?.code ?? '',
    branch_id: department?.branch_id ?? '',
    parent_id: department?.parent_id ?? '',
    description: department?.description ?? '',
    status: department?.status ?? 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Department name is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit ? await updateDepartment(department.id, form) : await createDepartment(form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
  }

  const parentOptions = departments.filter((d) => d.id !== department?.id)

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update department details.' : 'Create a new department.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Name <span className="text-destructive">*</span></Label>
            <Input id="dept-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Engineering" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept-code">Code</Label>
            <Input id="dept-code" value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="ENG" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dept-branch">Branch</Label>
          <Select value={form.branch_id} onValueChange={(v) => update('branch_id', v)}>
            <SelectTrigger id="dept-branch"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {branches.filter((b) => b.status === 'active').map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dept-parent">Parent Department</Label>
          <Select value={form.parent_id} onValueChange={(v) => update('parent_id', v)}>
            <SelectTrigger id="dept-parent"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {parentOptions.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dept-desc">Description</Label>
          <Textarea id="dept-desc" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Brief description" rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dept-status">Status</Label>
          <Select value={form.status} onValueChange={(v) => update('status', v)}>
            <SelectTrigger id="dept-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Department'}</Button>
      </DialogFooter>
    </>
  )
}

export function DepartmentDialog({ open, onOpenChange, department, departments, branches, onSaved }: DepartmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && <DeptForm key={department?.id ?? 'new'} department={department} departments={departments} branches={branches} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
