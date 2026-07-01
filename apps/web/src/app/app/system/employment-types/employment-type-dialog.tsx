'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createEmploymentType, updateEmploymentType, type EmploymentType } from './actions'

interface EmploymentTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employmentType: EmploymentType | null
  onSaved: () => void
}

function ETForm({ employmentType, onOpenChange, onSaved }: Omit<EmploymentTypeDialogProps, 'open'>) {
  const isEdit = !!employmentType
  const [form, setForm] = useState({
    name: employmentType?.name ?? '',
    description: employmentType?.description ?? '',
    status: employmentType?.status ?? 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit ? await updateEmploymentType(employmentType.id, form) : await createEmploymentType(form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Employment Type' : 'Add Employment Type'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update employment type details.' : 'Create a new employment type.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="et-name">Name <span className="text-destructive">*</span></Label>
          <Input id="et-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Time" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="et-desc">Description</Label>
          <Textarea id="et-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="et-status">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? 'active' })}>
            <SelectTrigger id="et-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}</Button>
      </DialogFooter>
    </>
  )
}

export function EmploymentTypeDialog({ open, onOpenChange, employmentType, onSaved }: EmploymentTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && <ETForm key={employmentType?.id ?? 'new'} employmentType={employmentType} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
